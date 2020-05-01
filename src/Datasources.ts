import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Dexie from 'dexie';
import { IAPIDatasource, IDexieDatasource } from './Types/Datasources';

type APIDatasourceProps = {
	baseURL: string
	headers: AxiosRequestConfig
}

export class APIDatasource implements IAPIDatasource {
	private datasource: AxiosInstance;
	constructor({ baseURL, headers }: APIDatasourceProps) {
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
	constructor(database: string, stores: any, indexeddb?: any) {
		this.datasource = new Dexie(database, { indexedDB: indexeddb });
		this.datasource.version(1).stores(stores)
	}
	getDatasource(): Dexie {
		return this.datasource;
	}
	async setAll<T>(table: string, data: T[], keys: string[]): Promise<any> {
		await this.datasource.table<T>(table).clear();
		return this.datasource.table<T>(table).bulkAdd(data, keys);
	}
	async getAll<T>(table: string): Promise<T[]> {
		return this.datasource.table<T>(table).toArray()
	}
	async get<T>(table: string, key: string): Promise<T | undefined> {
		return this.datasource.table<T>(table).get(key);
	}
	async set<T>(table: string, data: T, key: string): Promise<any> {
		return this.datasource.table<T>(table).put(data, key);
	}
	async delete<T>(table: string, key: string): Promise<void> {
		await this.datasource.table<T>(table).delete(key);
	}
	async update<T>(table: string, key: string, data: any): Promise<void> {
		await this.datasource.table<T>(table).update(key, data);
	}
}