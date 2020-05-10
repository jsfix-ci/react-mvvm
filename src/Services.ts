import { LoopBackQueryFilter } from "./Third-party/Loopback-next";
import { IService, BaseService, ServicesProps } from './Types';
import { Model } from "./Models";

export abstract class Service<T extends Model> extends BaseService implements IService<T> {
	protected api_path: string;
	constructor({ API_PATH, client, pathParams }: ServicesProps) {
		super(client);
		this.api_path = API_PATH;
		if (pathParams) {
			for (const param in pathParams) {
				this.api_path = this.api_path.replace(`{${param}}`, pathParams[param])
			}
		}
	}
	abstract createModel(data: Partial<T>): T;
	getAll = async (): Promise<T[]> => {
		const res = await this.client.get(this.api_path);
		const Ts: T[] = [];
		res.data.forEach((data: Partial<T>) => {
			Ts.push(this.createModel(data))
		});
		return Ts;
	}
	find = async (filter: LoopBackQueryFilter): Promise<T[]> => {
		const res = await this.client.get(`${this.api_path}?filter=${JSON.stringify(filter)}`);
		const Ts: T[] = [];
		res.data.forEach((data: Partial<T>) => {
			Ts.push(this.createModel(data))
		});
		return Ts;
	}
	get = async (id: string): Promise<T> => {
		const res = await this.client.get(`${this.api_path}/${id}`);
		return this.createModel(res.data);
	}
	create = async (model: T): Promise<T> => {
		const res = await this.client.post(this.api_path, JSON.stringify(model.Deserialize()));
		return this.createModel(res.data);
	}
	delete = async (id: string): Promise<boolean> => {
		const res = await this.client.delete(`${this.api_path}/${id}`);
		return (res.status === 204);
	}
	update = async (id: string, model: T): Promise<boolean> => {
		const res = await this.client.put(`${this.api_path}/${id}`, JSON.stringify(model.Deserialize()));
		return (res.status === 204);
	}
}