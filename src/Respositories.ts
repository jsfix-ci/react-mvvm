import _ from 'lodash';
import { Subject } from "rxjs";
import { IRepository, RepositoryPolicy } from './Types/Repositories';
import { LoopBackQueryFilter } from "./Third-party/Loopback-next";
import Service from "./Services";
import Model from "./Models";
import { DexieDatasource } from "./Datasources";

export type RepositoryProps<T extends Model> = {
	ds: DexieDatasource
	service: Service<T>
	policy?: RepositoryPolicy
	table: string
}

abstract class Repository<T extends Model> implements IRepository<T> {
	protected ds: DexieDatasource;
	protected service: Service<T>;
	protected policy: RepositoryPolicy;
	protected table: string;
	constructor({ ds, service, policy, table }: RepositoryProps<T>) {
		this.ds = ds;
		this.service = service;
		this.policy = (policy) ? policy : "API_FIRST";
		this.table = table;
	}
	setPolicy = (policy: RepositoryPolicy): this => {
		this.policy = policy;
		return this;
	}
	abstract keysFromModels(data: T[]): string[];
	abstract keyFromModel(data: T): string;
	getAll = (): Subject<T[]> => {
		const subject = new Subject<T[]>()
		switch (this.policy) {
			case "API_FIRST":
				this.service.getAll()
					.then(async (models) => {
						subject.next(models);
						let dbModels = await this.ds.getAll<T>(this.table);
						dbModels = _.assign([], dbModels, models);
						await this.ds.setAll<T>(this.table, dbModels, this.keysFromModels(dbModels));
						subject.next(dbModels);
					})
					.catch( async () => {
						let models = await this.ds.getAll<T>(this.table)
						subject.next(models);
					}).finally(() => {
						subject.complete();
					})
				break;
			case "DATABASE_FIRST":
				this.ds.getAll<T>(this.table)
					.then(async (models) => {
						subject.next(models);
						models = await this.service.getAll();
						let dbModels = await this.ds.getAll<T>(this.table)
						dbModels = _.assign([], dbModels, models);
						await this.ds.setAll<T>(this.table, dbModels, this.keysFromModels(dbModels));
						subject.next(dbModels);
					})
					.finally(() => {
						subject.complete()
					})
				break;
		}
		return subject;
	}
	find = (filter: LoopBackQueryFilter): Subject<T[]> => {
		const subject = new Subject<T[]>()
		switch (this.policy) {
			case "API_FIRST":
				this.service.find(filter)
					.then(async (models) => {
						let dbData = await this.ds.getAll<T>(this.table);
						dbData = _.assign([], dbData, models);
						await this.ds.setAll<T>(this.table, dbData, this.keysFromModels(dbData));
						subject.next(models);
					})
					.catch( async () => {
						let models = await this.ds.getAll<T>(this.table)
						models = this.filterData(models, filter);
						subject.next(models);
					}).finally(() => {
						subject.complete();
					})
				break;
			case "DATABASE_FIRST":
				this.ds.getAll<T>(this.table)
					.then(async (models) => {
						models = this.filterData(models, filter);
						subject.next(models);
						models = await this.service.find(filter);
						let dbModels = await this.ds.getAll<T>(this.table);
						dbModels = _.assign([], dbModels, models);
						await this.ds.setAll<T>(this.table, dbModels, this.keysFromModels(dbModels));
						subject.next(models);
					})
					.finally(() => {
						subject.complete()
					})
				break;
		}
		return subject;
	}
	abstract filterData(data: T[], filter: LoopBackQueryFilter): T[];
	get = (id: string): Subject<T> => {
		const subject = new Subject<T>()
		switch (this.policy) {
			case "API_FIRST":
				this.service.get(id)
					.then((model) => {
						subject.next(model);
					})
					.catch( async () => {
						let model = await this.ds.get<T>(this.table, id)
						subject.next(model);
					}).finally(() => {
						subject.complete();
					})
				break;
			case "DATABASE_FIRST":
				this.ds.get<T>(this.table, id)
					.then(async (model) => {
						if (model !== undefined) {
							subject.next(model);
						}
						throw "Go fetch the API";
					}).catch(async () => {
						let model = await this.service.get(id)
						await this.ds.update<T>(this.table, id, model);
						subject.next(model);
					})
					.finally(() => {
						subject.complete()
					})
				break;
		}
		return subject;
	}
	create = (data: any): Subject<T> => {
		const subject = new Subject<T>()
		this.service.create(data).then(async (model) => {
			subject.next(model);
			await this.ds.set<T>(this.table, model, this.keyFromModel(model))
			subject.complete();
		})
		return subject;
	}
	delete = async (id: string): Promise<boolean> => {
		const result = await this.service.delete(id);
		if (result) await this.ds.delete<T>(this.table, id);
		return result;
	}
	update = async (id: string, model: any): Promise<boolean> => {
		const result = await this.service.update(id, model);
		if (result) await this.ds.update<T>(this.table, id, model);
		return result;
	}
}

export default Repository;