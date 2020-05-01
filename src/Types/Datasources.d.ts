import Dexie from "dexie";
import { AxiosInstance } from "axios";

export interface IDatasource {
	getDatasource(): any;
}

export interface IIndexedDBDatasource implements IDatasource {
	getDatasource(): IDBFactory;
}

export interface IDexieDatasource implements IDatasource {
	getDatasource(): Dexie;
	async getAll<T>(table: string): Promise<T[]>;
	async setAll<T>(table: string, data: T[], keys: string[]): Promise<any>;
	async get<T>(table: string, key: string): Promise<T | undefined>
	async set<T>(table: string, data: T, key: string): Promise<any>;
	async delete<T>(table: string, key: string): Promise<void>
	async update<T>(table: string, key: string, data: T): Promise<void>
}

export interface IAPIDatasource implements IDatasource {
	getDatasource(): AxiosInstance;
}