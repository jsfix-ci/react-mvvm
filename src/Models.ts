import { AnyObject, Reflector, CLASS_ID_PROPERTY_METADATA_KEY, CLASS_TABLE_METADATA_KEY, CLASS_API_PATH_METADATA_KEY } from './Types';

export abstract class Model {
	[name: string]: any
	constructor(data: Partial<Model>) {
		Object.assign(this, data)
	}
	Deserialize(): Object {
		const data: AnyObject = {};
		for (const prop in this) {
			if (typeof this[prop] !== 'function') data[prop] = this[prop]
		}
		return data
	}
	getId() {
		if (Reflector.hasMetadata(CLASS_ID_PROPERTY_METADATA_KEY, this)) {
			return this[Reflector.getMetadata(CLASS_ID_PROPERTY_METADATA_KEY, this)]
		} else {
			throw Error("No ID property set using '@property' decorator!")
		}
	}
	static getTable(target: any = this) {
		if (Reflector.hasMetadata(CLASS_TABLE_METADATA_KEY, target)) {
			return Reflector.getMetadata(CLASS_TABLE_METADATA_KEY, target)
		} else {
			throw Error("No table set using '@model' decorator!")
		}
	}
	static getApiPath(target: any = this) {
		if (Reflector.hasMetadata(CLASS_API_PATH_METADATA_KEY, target)) {
			return Reflector.getMetadata(CLASS_API_PATH_METADATA_KEY, target)
		} else {
			throw Error("No api path set using '@model' decorator!")
		}
	}
}