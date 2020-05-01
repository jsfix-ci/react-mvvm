import { Subject } from "rxjs";
import { LoopBackQueryFilter } from "../Third-party/Loopback-next";

export type RepositoryPolicy = 'API_FIRST' | 'DATABASE_FIRST';

export interface IRepository<T> {
	getAll(): Subject<T[]>
	find(filter: LoopBackQueryFilter): Subject<T[]>
	get(id: string): Subject<T>
	create(model: any): Subject<T>
	async delete(id: string): Promise<boolean>
	async update(id: string, model: any): Promise<boolean>
}