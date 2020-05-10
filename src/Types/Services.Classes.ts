import { AxiosInstance } from 'axios';
import { IBaseService } from './Services';

/**
 * Base service class
 */
export class BaseService implements IBaseService {
	protected client: AxiosInstance;
	constructor(client: AxiosInstance) {
		this.client = client;
	}
	setClient = (client: AxiosInstance) => {
		this.client = client;
	}
}