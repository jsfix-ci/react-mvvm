/**
 * Property definition for a model
 */
export type PropertyDefinition = {
	id: boolean
}

/**
 * An extension of the built-in Partial<T> type which allows partial values
 * in deeply nested properties too.
 */
export type DeepPartial<T> =
	| Partial<T> // handle free-form properties, e.g. DeepPartial<AnyObject>
	| { [P in keyof T]?: DeepPartial<T[P]> };

/**
 * Type alias for strongly or weakly typed objects of T
 */
export type DataObject<T extends object> = T | DeepPartial<T>;

/**
 * Objects with open properties
 */
export interface AnyObject {
	[property: string]: any;
}

/**
 * Model definition.
 */
export interface ModelDefinition {
	table: string,
	api_path: string,
}