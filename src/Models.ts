import { AnyObject, Reflector, CLASS_ID_PROPERTY_METADATA_KEY } from './Types';

export class Model {
	[name: string]: any
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
}