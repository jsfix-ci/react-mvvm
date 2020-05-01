import Dexie from "dexie";
import { AxiosInstance } from "axios";

export interface IDexieDatasource {
	getDatasource(): Dexie;
	getAll<T>(table: string): Promise<T[]>;
	setAll<T>(table: string, data: T[], keys: string[]): Promise<any>;
	get<T>(table: string, key: string): Promise<T | undefined>
	set<T>(table: string, data: T, key: string): Promise<any>;
	delete<T>(table: string, key: string): Promise<void>
	update<T>(table: string, key: string, data: T): Promise<void>
}

export interface IAPIDatasource {
	getDatasource(): AxiosInstance;
}