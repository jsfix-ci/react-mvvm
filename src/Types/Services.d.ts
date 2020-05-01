import { LoopBackQueryFilter } from "../Third-party/Loopback-next";

export interface IBaseService {
	setClient: (client: AxiosInstance) => void;
}

export interface IService<T extends Model> {
	async getAll(): Promise<T[]>
	async find(filter: LoopBackQueryFilter): Promise<T[]>
	async get(id: string): Promise<T>
	async create(model: any): Promise<T>
	async delete(id: string): Promise<boolean>
	async update(id: string, model: any): Promise<boolean>
}