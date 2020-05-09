import { PropertyDefinition, ModelDefinitionSyntax } from './Models.Definitions';

/**
* Definition for a model
*/
export class ModelDefinition {
	readonly name: string
	properties: { [name: string]: PropertyDefinition }
	settings: { [name: string]: any }

	constructor(nameOrDef: string | ModelDefinitionSyntax) {
		if (typeof nameOrDef === 'string') {
			nameOrDef = { name: nameOrDef }
		}
		const { name, properties, settings } = nameOrDef

		this.name = name

		this.properties = {}
		if (properties) {
			for (const p in properties) {
				this.addProperty(p, properties[p])
			}
		}

		this.settings = settings ?? new Map()
	}

	/**
	* Add a property
	* @param name - Property name (string)
	* @param definition - Definition of property
	*/
	addProperty(
		name: string,
		definition: PropertyDefinition,
	): this {
		this.properties[name] = definition
		return this
	}

	/**
	* Add a setting
	* @param name - Setting name
	* @param value - Setting value
	*/
	addSetting(name: string, value: any): this {
		this.settings[name] = value
		return this
	}

	/**
	* Get an array of names of ID properties, which are specified in
	* the model settings or properties with `id` attribute.
	*/
	idProperties(): string[] {
		if (typeof this.settings.id === 'string') {
			return [this.settings.id]
		} else if (Array.isArray(this.settings.id)) {
			return this.settings.id
		}
		const idProps = Object.keys(this.properties).filter(
			prop => this.properties[prop].id
		)
		return idProps
	}
}