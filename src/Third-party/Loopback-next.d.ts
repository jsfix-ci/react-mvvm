type LoopBackQueryDate = {
	gt?: Date | Number
	lt?: Date | Number
}

type LoopBackQueryBetween = {
	between: Number[]
}

type LoopBackQueryLikeNotLike = {
	like?: string
	nlike?: string
}

type LoopBackQueryInArray = {
	inq: string[]
}

type LoopBackQueryWhere = {
	[property: string]: string | LoopBackQueryDate | LoopBackQueryBetween | LoopBackQueryLikeNotLike | LoopBackQueryInArray
}

type LoopBackQueryInclude = {
	relation: string
	scope: LoopBackQueryScope
}

type LoopBackQueryScope = {
	offset?: Number
	limit?: Number
	skip?: Number
	order?: string[]
	where?: LoopBackQueryWhere
	fields?: {
		[field: string]: boolean
	}
	include?: LoopBackQueryInclude[]
}

export type LoopBackQueryFilter = LoopBackQueryScope