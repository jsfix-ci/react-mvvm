import { Model } from "../Models"
import { model } from '../Decorators'
import { Repository } from '../Respositories'
import { Service } from '../Services'
import Axios from 'axios'
import { LoopBackQueryScope } from '../Third-party'

describe('Repositories', () => {
	test('should create a new instance', () => {
		@model({
			api_path: 'api',
			table: 'table'
		})
		class TestModel extends Model { }
		class TestRepository extends Repository<TestModel> {
			filterData(data: TestModel[], filter: LoopBackQueryScope): TestModel[] {
				throw new Error("Method not implemented.")
			}
		}
		class TestService extends Service<TestModel> {
			createModel(data: any): TestModel {
				throw new Error("Method not implemented.")
			}

		}
		const ds: any = {}
		const service = new TestService({ API_PATH: TestModel.getApiPath(), client: Axios.create() })
		const table = TestModel.getTable()
		const tr = new TestRepository({ ds, service, table })
		expect(tr).toBeInstanceOf(TestRepository);
	})
})