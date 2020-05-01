import Dexie from "dexie";
import { AxiosInstance } from "axios";
import { Model } from '../Models';

export interface IDexieDatasource {
	getDatasource(): Dexie;
	getAll<T extends Model>(table: string): Promise<T[]>;
	setAll<T extends Model>(table: string, data: T[], keys: string[]): Promise<any>;
	get<T extends Model>(table: string, key: string): Promise<T | undefined>;
	set<T extends Model>(table: string, data: T, key: string): Promise<any>;
	delete<T extends Model>(table: string, key: string): Promise<void>;
	update<T extends Model>(table: string, key: string, data: T): Promise<void>;
}

export interface IAPIDatasource {
	getDatasource(): AxiosInstance;
}