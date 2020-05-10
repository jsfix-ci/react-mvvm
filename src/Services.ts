import { LoopBackQueryFilter } from "./Third-party/Loopback-next";
import { IService, BaseService, ServicesProps } from './Types';
import { Model } from "./Models";

export abstract class Service<T extends Model> extends BaseService implements IService<T> {
	protected api_path: string;
	constructor({ API_PATH, client }: ServicesProps) {
		super(client);
		this.api_path = API_PATH;

	}
	private renderPath(pathParams?: { [param: string]: string }) {
		let result = this.api_path;
		if (pathParams) {
			for (const param in pathParams) {
				result = result.replace(`{${param}}`, pathParams[param])
			}
		}
		return result
	}
	abstract createModel(data: Partial<T>): T;
	getAll = async (pathParams?: { [param: string]: string }): Promise<T[]> => {
		const res = await this.client.get(this.renderPath(pathParams));
		const Ts: T[] = [];
		res.data.forEach((data: Partial<T>) => {
			Ts.push(this.createModel(data))
		});
		return Ts;
	}
	find = async (filter: LoopBackQueryFilter, pathParams?: { [param: string]: string }): Promise<T[]> => {
		const res = await this.client.get(`${this.renderPath(pathParams)}?filter=${JSON.stringify(filter)}`);
		const Ts: T[] = [];
		res.data.forEach((data: Partial<T>) => {
			Ts.push(this.createModel(data))
		});
		return Ts;
	}
	get = async (id: string, pathParams?: { [param: string]: string }): Promise<T> => {
		const res = await this.client.get(`${this.renderPath(pathParams)}/${id}`);
		return this.createModel(res.data);
	}
	create = async (model: T, pathParams?: { [param: string]: string }): Promise<T> => {
		const res = await this.client.post(this.renderPath(pathParams), JSON.stringify(model.Deserialize()));
		return this.createModel(res.data);
	}
	delete = async (id: string, pathParams?: { [param: string]: string }): Promise<boolean> => {
		const res = await this.client.delete(`${this.renderPath(pathParams)}/${id}`);
		return (res.status === 204);
	}
	update = async (id: string, model: T, pathParams?: { [param: string]: string }): Promise<boolean> => {
		const res = await this.client.put(`${this.renderPath(pathParams)}/${id}`, JSON.stringify(model.Deserialize()));
		return (res.status === 204);
	}
}