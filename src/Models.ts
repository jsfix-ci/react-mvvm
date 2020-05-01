class Model {
	static Serialize<T>(model: T, data: any): T {
		return Object.assign(model, data);
	}
	Deserialize(): any {
		const data: any = {};
		for(const prop in this) {
			data[prop] = this[prop];
		}
		return data;
	}
}

export default Model;