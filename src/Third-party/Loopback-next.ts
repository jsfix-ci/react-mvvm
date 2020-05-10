export type LoopBackQueryDate = {
	gt?: Date | Number
	lt?: Date | Number
}

export type LoopBackQueryBetween = {
	between: Number[]
}

export type LoopBackQueryLikeNotLike = {
	like?: string
	nlike?: string
}

export type LoopBackQueryInArray = {
	inq: string[]
}

export type LoopBackQueryWhere = {
	[property: string]: string | LoopBackQueryDate | LoopBackQueryBetween | LoopBackQueryLikeNotLike | LoopBackQueryInArray
}

export type LoopBackQueryInclude = {
	relation: string
	scope: LoopBackQueryScope
}

export type LoopBackQueryScope = {
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