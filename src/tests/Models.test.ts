import { Model } from "../Models"
import { property, model } from '../Decorators'

describe('Models', () => {
	test('should return ID property\'s value of model', () => {
		class TestModel extends Model {
			constructor(data: Partial<TestModel>) {
				super(data)
			}

			@property({
				id: true
			})
			idProperty: string
		}
		const tm = new TestModel({
			idProperty: 'Test'
		})
		expect(tm.getId()).toBe(tm.idProperty)
	})
	test('should return table & api_path metadata values', () => {
		@model({
			api_path: 'api-path',
			table: 'my-table'
		})
		class TestModel extends Model { }
		expect(TestModel.getTable()).toBe("my-table")
		expect(TestModel.getApiPath()).toBe("api-path")
	})
})