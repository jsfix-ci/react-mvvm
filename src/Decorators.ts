import { ModelDefinition, ModelDefinitionSyntax, ClassDecoratorFactory, PropertyDefinition, MetadataMap, MetadataAccessor, PropertyDecoratorFactory } from './Types'
import { MetadataInspector } from './Types/Decorators.Inspectors';

export const MODEL_KEY = MetadataAccessor.create<
	Partial<ModelDefinitionSyntax>,
	ClassDecorator
>('react-mvvm:model');
export const MODEL_PROPERTIES_KEY = MetadataAccessor.create<
	PropertyDefinition,
	PropertyDecorator
>('react-mvvm:model-properties');
export const MODEL_WITH_PROPERTIES_KEY = MetadataAccessor.create<
	ModelDefinition,
	ClassDecorator
>('react-mvvm:model-and-properties');

export type PropertyMap = MetadataMap<PropertyDefinition>;

/**
* Decorator for model definitions
* @param definition
* @returns A class decorator for `model`
*/
export function model(definition?: Partial<ModelDefinitionSyntax>) {
	return function (target: Function & { definition?: ModelDefinition }) {
		definition = definition ?? {};
		const def: ModelDefinitionSyntax = Object.assign(definition, {
			name: definition.name ?? target.name,
		});
		const decorator = ClassDecoratorFactory.createDecorator(
			MODEL_KEY,
			definition,
			{ decoratorName: '@model' },
		);

		decorator(target);

		// Build "ModelDefinition" and store it on model constructor
		buildModelDefinition(target, def);
	};
}

/**
* Build model definition from decorations
* @param target - Target model class
* @param def - Model definition spec
*/
export function buildModelDefinition(
	target: Function & { definition?: ModelDefinition },
	def?: ModelDefinitionSyntax,
) {
	// Check if the definition for this class has been built (not from the super
	// class)
	const baseClass = Object.getPrototypeOf(target);
	if (
		!def &&
		target.definition &&
		baseClass &&
		target.definition !== baseClass.definition
	) {
		return target.definition;
	}
	const modelDef = new ModelDefinition(def ?? { name: target.name });
	const prototype = target.prototype;
	const propertyMap: PropertyMap =
		MetadataInspector.getAllPropertyMetadata(MODEL_PROPERTIES_KEY, prototype) ?? {};
	for (const p in propertyMap) {
		modelDef.addProperty(p, propertyMap[p]);
	}
	target.definition = modelDef;
	return modelDef;
}

/**
* Decorator for model properties
* @param definition
* @returns A property decorator
*/
export function property(definition?: Partial<PropertyDefinition>) {
	return PropertyDecoratorFactory.createDecorator(
		MODEL_PROPERTIES_KEY,
		Object.assign({}, definition),
		{ decoratorName: '@property' },
	);
}
