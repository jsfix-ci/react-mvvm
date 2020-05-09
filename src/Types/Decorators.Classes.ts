import { DecoratorType } from './Decorators.Definitions';

/**
 * A strongly-typed metadata accessor via reflection
 * @typeParam T - Type of the metadata value
 * @typeParam D - Type of the decorator
 */
export class MetadataAccessor<T, D extends DecoratorType = DecoratorType> {
	private constructor(public readonly key: string) { }

	toString() {
		return this.key;
	}

	/**
	 * Create a strongly-typed metadata accessor
	 * @param key - The metadata key
	 * @typeParam T - Type of the metadata value
	 * @typeParam D - Type of the decorator
	 */
	static create<T, D extends DecoratorType>(key: string) {
		return new MetadataAccessor<T, D>(key);
	}
}