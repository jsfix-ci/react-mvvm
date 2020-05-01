import { AxiosInstance } from 'axios';
import { Model } from '../Models';
import { LoopBackQueryFilter } from "../Third-party";

export interface IBaseService {
	setClient: (client: AxiosInstance) => void;
}

export interface IService<T extends Model> {
	getAll(): Promise<T[]>
	find(filter: LoopBackQueryFilter): Promise<T[]>
	get(id: string): Promise<T>
	create(model: any): Promise<T>
	delete(id: string): Promise<boolean>
	update(id: string, model: any): Promise<boolean>
}