import { AnyObject } from './Types';

export class Model {
	[name: string]: any
	Deserialize(): Object {
		const data: AnyObject = {};
		for (const prop in this) {
			if (typeof this[prop] !== 'function' && prop !== 'decoratorIdProperty') data[prop] = this[prop]
		}
		return data
	}
	idProperty = () => {
		if (this.decoratorIdProperty) return this[this.decoratorIdProperty]
		throw Error("No ID property set using '@property' decorator!")
	}
}