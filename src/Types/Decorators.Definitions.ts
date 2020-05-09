import { PropertyDefinition } from './Models.Definitions';
import { MetadataAccessor } from './Decorators.Classes';
/**
* Decorator function types
*/
export type DecoratorType =
	| ClassDecorator
	| PropertyDecorator
	| MethodDecorator
	| ParameterDecorator

/**
* Key for metadata access via reflection
* @typeParam T - Type of the metadata value
* @typeParam D - Type of the decorator
*/
export type MetadataKey<T, D extends DecoratorType> =
	| MetadataAccessor<T, D>
	| string;

/**
* An object mapping keys to corresponding metadata
*/
export interface MetadataMap<T> {
	[propertyOrMethodName: string]: T;
}

/**
 * Design time metadata for a method.
 *
 */
export interface DesignTimeMethodMetadata {
	/**
	* Type of the method itself. It is `Function`
	*/
	type: Function;
	/**
	* An array of parameter types
	*/
	parameterTypes: Function[];
	/**
	* Return type
	*/
	returnType: Function;
}

/**
 * Options for a decorator
 */
export interface DecoratorOptions {
	/**
	 * Name of the decorator for debugging purpose, such as `@inject`
	 */
	decoratorName?: string;
}