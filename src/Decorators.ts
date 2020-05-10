import { ModelDefinition, PropertyDefinition, Reflector, CLASS_ID_PROPERTY_METADATA_KEY, CLASS_TABLE_METADATA_KEY, CLASS_API_PATH_METADATA_KEY } from './Types'

/**
* Decorator for model definitions
* @param definition
* @returns A class decorator for `model`
*/
export const model = (definition: ModelDefinition) => {
	return function (target: Function) {
		Reflector.defineMetadata(CLASS_TABLE_METADATA_KEY, definition.table, target);
		Reflector.defineMetadata(CLASS_API_PATH_METADATA_KEY, definition.api_path, target);
	}
}

/**
* Decorator for model properties
* @param definition
* @returns A property decorator
*/
export const property = (definition: PropertyDefinition) => {
	return (target: any, propertyName: string) => {
		if (definition.id) {
			if (!Reflector.hasMetadata(CLASS_ID_PROPERTY_METADATA_KEY, target)) {
				Reflector.defineMetadata(CLASS_ID_PROPERTY_METADATA_KEY, propertyName, target);
			} else {
				throw Error("A model can only have a single ID property!")
			}
		}
	}
}

/**
 * Decorator for model methods
 * @param definition
 * @returns A method decorator
 */
export const method = (definition?: any) => {
	return (
		target: Object,
		methodName: string | symbol,
		descriptor: TypedPropertyDescriptor<any>,
	) => {
		// TODO: WHAT HAPPENS HERE
	}
}

/**
 * Decorator for methods' parameters
 * @param definition
 * @returns A parameter decorator
 */
export const parameter = (definition?: any) => {
	return (
		target: Object,
		methodName: string | symbol,
		parameterIndex: number,
	) => {
		// TODO: WHAT HAPPENS HERE
	}
}