import { Model } from "../Models"
import { property } from '../Decorators'

describe('Models', () => {
	test('should return ID property\'s value of model', () => {
		class TestClass extends Model {
			constructor(data: Partial<TestClass>) {
				super()
				Object.assign(this, data)
			}

			@property({
				id: true
			})
			idProperty: string
		}
		const tc = new TestClass({
			idProperty: 'Test'
		})
		expect(tc.getId()).toBe(tc.idProperty)
	})
})