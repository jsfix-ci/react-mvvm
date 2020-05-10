import { model, property } from "../Decorators";
import { Reflector, CLASS_API_PATH_METADATA_KEY, CLASS_TABLE_METADATA_KEY, CLASS_ID_PROPERTY_METADATA_KEY } from '../Types';

describe('Decorators', () => {
	test('should decorate a class with table & api_path metadata keys', () => {
		@model({
			table: 'table',
			api_path: 'api_path'
		})
		class TestClass { }
		const table = Reflector.getMetadata(CLASS_TABLE_METADATA_KEY, TestClass)
		const api_path = Reflector.getMetadata(CLASS_API_PATH_METADATA_KEY, TestClass)
		expect(table).toBe("table")
		expect(api_path).toBe("api_path")
	})
	test('should decorate a class with id property', () => {
		class TestClass {
			@property({
				id: true
			})
			idProperty: string
		}
		const tc = new TestClass()
		expect(Reflector.getMetadata(CLASS_ID_PROPERTY_METADATA_KEY, tc)).toBe("idProperty")
	})
})