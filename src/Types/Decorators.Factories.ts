import _ from 'lodash';
import { MetadataMap, DecoratorType, MetadataKey, DecoratorOptions } from './Decorators.Definitions';
import { PropertyDefinition } from './Models.Definitions';

/**
 * Base factory class for decorator functions
 */
export class DecoratorFactory<
	T, // Type of the metadata spec for individual class/method/property/parameter
	M extends T | MetadataMap<T> | MetadataMap<T[]>, // Type of the metadata
	D extends DecoratorType // Type of the decorator
	> {
	protected decoratorName: string;

	/**
	 * A constant to reference the target of a decoration
	 */
	static TARGET = '__decoratorTarget';

	/**
	 * Construct a new class decorator factory
	 * @param key - Metadata key
	 * @param spec - Metadata object from the decorator function
	 * @param options - Options for the decorator. Default to
	 * `{allowInheritance: true}` if not provided
	 */
	constructor(
		protected key: string,
		protected spec: T,
		protected options: DecoratorOptions = {},
	) {
		this.options = options
		const defaultDecoratorName = this.constructor.name.replace(/Factory$/, '')
		this.decoratorName = this.options.decoratorName ?? defaultDecoratorName
	}

	/**
	 * Get the qualified name of a decoration target.
	 * 
	 * @param target - Class or prototype of a class
	 * @param member - Optional property/method name
	 * @param descriptorOrIndex - Optional method descriptor or parameter index
	 */
	static getTargetName(
		target: Object,
		member?: string | symbol,
		descriptorOrIndex?: TypedPropertyDescriptor<any> | number,
	) {
		let name =
			target instanceof Function
				? target.name
				: `${target.constructor.name}.prototype`;
		if (member == null && descriptorOrIndex == null) {
			return `class ${name}`;
		}
		if (member == null) member = 'constructor';

		const memberAccessor =
			typeof member === 'symbol' ? '[' + member.toString() + ']' : '.' + member;

		if (typeof descriptorOrIndex === 'number') {
			// Parameter
			name = `${name}${memberAccessor}[${descriptorOrIndex}]`;
		} else if (descriptorOrIndex != null) {
			name = `${name}${memberAccessor}()`;
		} else {
			name = `${name}${memberAccessor}`;
		}
		return name;
	}

	/**
	 * Get the number of parameters for a given constructor or method
	 * @param target - Class or the prototype
	 * @param member - Method name
	 */
	static getNumberOfParameters(target: Object, member?: string) {
		if (typeof target === 'function' && !member) {
			// constructor
			return target.length;
		} else {
			// target[member] is a function
			const method = (<{ [methodName: string]: Function }>target)[member!];
			return method.length;
		}
	}

	/**
	 * Create a decorator function of the given type. Each sub class MUST
	 * implement this method.
	 */
	create(): D {
		throw new Error(`create() is not implemented for ${this.decoratorName}`);
	}

	/**
	 * Create a decorator function
	 * @param key - Metadata key
	 * @param spec - Metadata object from the decorator function
	 * @param options - Options for the decorator
	 */
	protected static _createDecorator<
		T,
		M extends T | MetadataMap<T> | MetadataMap<T[]>,
		D extends DecoratorType
	>(key: MetadataKey<T, D>, spec: T, options?: DecoratorOptions): D {
		const inst = new this<T, M, D>(key.toString(), spec, options);
		return inst.create();
	}
}

/**
 * Factory for class decorators
 */
export class ClassDecoratorFactory<T> extends DecoratorFactory<
	T,
	T,
	ClassDecorator
	> {

	create(): ClassDecorator {
		return (target: Function) => {
			// TODO: WHAT HAPPENS HERE
		}
	}

	/**
	 * Create a class decorator function
	 * @param key - Metadata key
	 * @param spec - Metadata object from the decorator function
	 * @param options - Options for the decorator
	 */
	static createDecorator<T>(
		key: MetadataKey<T, ClassDecorator>,
		spec: T,
		options?: DecoratorOptions,
	) {
		return super._createDecorator<T, T, ClassDecorator>(key, spec, options);
	}
}

/**
 * Factory for property decorators
 */
export class PropertyDecoratorFactory<T extends PropertyDefinition> extends DecoratorFactory<
	T,
	MetadataMap<T>,
	PropertyDecorator
	> {

	create(): PropertyDecorator {
		return (target: any, propertyName: string | symbol) => {
			if (this.spec.id) {
				if (delete target['decoratorIdProperty']) {
					Object.defineProperty(target, 'decoratorIdProperty', {
						get: () => propertyName,
						set: (_: string) => { },
						configurable: true,
						enumerable: true
					})
				}
			}
		}
	}

	/**
	 * Create a property decorator function
	 * @param key - Metadata key
	 * @param spec - Metadata object from the decorator function
	 * @param options - Options for the decorator
	 */
	static createDecorator<T>(
		key: MetadataKey<T, PropertyDecorator>,
		spec: T,
		options?: DecoratorOptions,
	) {
		return super._createDecorator<T, MetadataMap<T>, PropertyDecorator>(
			key,
			spec,
			options,
		);
	}
}

/**
 * Factory for method decorators
 */
export class MethodDecoratorFactory<T> extends DecoratorFactory<
	T,
	MetadataMap<T>,
	MethodDecorator
	> {

	create(): MethodDecorator {
		return (
			target: Object,
			methodName: string | symbol,
			descriptor: TypedPropertyDescriptor<any>,
		) => {
			// TODO: WHAT HAPPENS HERE
		}
	}

	/**
	 * Create a method decorator function
	 * @param key - Metadata key
	 * @param spec - Metadata object from the decorator function
	 * @param options - Options for the decorator
	 */
	static createDecorator<T>(
		key: MetadataKey<T, MethodDecorator>,
		spec: T,
		options?: DecoratorOptions,
	) {
		return super._createDecorator<T, MetadataMap<T>, MethodDecorator>(
			key,
			spec,
			options,
		);
	}
}

/**
 * Factory for parameter decorators
 */
export class ParameterDecoratorFactory<T> extends DecoratorFactory<
	T,
	MetadataMap<T[]>,
	ParameterDecorator
	> {

	create(): ParameterDecorator {
		return (
			target: Object,
			methodName: string | symbol,
			parameterIndex: number,
		) => {
			// TODO: WHAT HAPPENS HERE
		}
	}

	/**
	 * Create a parameter decorator function
	 * @param key - Metadata key
	 * @param spec - Metadata object from the decorator function
	 * @param options - Options for the decorator
	 */
	static createDecorator<T>(
		key: MetadataKey<T, ParameterDecorator>,
		spec: T,
		options?: DecoratorOptions,
	) {
		return super._createDecorator<T, MetadataMap<T[]>, ParameterDecorator>(
			key,
			spec,
			options,
		);
	}
}