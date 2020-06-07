import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Dexie from 'dexie';
import { IAPIDatasource, IDexieDatasource } from './Types/Datasources';
import { Model } from './Models';

export class APIDatasource implements IAPIDatasource {
	private datasource: AxiosInstance;
	constructor({ baseURL, headers }: AxiosRequestConfig) {
		this.datasource = Axios.create({
			baseURL,
			headers
		})
	}
	getDatasource(): AxiosInstance {
		return this.datasource;
	}
}

export class DexieDatasource implements IDexieDatasource {
	private datasource: Dexie;
	constructor(database: string, stores: any, version: number = 1, indexeddb?: any) {
		this.datasource = new Dexie(database, { indexedDB: indexeddb })
		this.datasource.version(version).stores(stores)
	}
	open(): this {
		this.datasource.open()
		return this
	}
	getDatasource(): Dexie {
		return this.datasource;
	}
	async setAll<T extends Model>(table: string, data: T[], keys?: string[]): Promise<any> {
		await this.datasource.table<T>(table).clear();
		if (keys) return this.datasource.table<T>(table).bulkAdd(data, keys);
		else return this.datasource.table<T>(table).bulkAdd(data);
	}
	async getAll<T extends Model>(table: string): Promise<T[]> {
		return this.datasource.table<T>(table).toArray()
	}
	async get<T extends Model>(table: string, key: string): Promise<T | undefined> {
		return this.datasource.table<T>(table).get(key);
	}
	async set<T extends Model>(table: string, data: T, key?: string): Promise<any> {
		if (key) return this.datasource.table<T>(table).put(data, key);
		else return this.datasource.table<T>(table).put(data);
	}
	async delete<T extends Model>(table: string, key: string): Promise<void> {
		await this.datasource.table<T>(table).delete(key);
	}
	async update<T extends Model>(table: string, key: string, data: any): Promise<void> {
		await this.datasource.table<T>(table).update(key, data);
	}
}