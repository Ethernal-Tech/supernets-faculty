import { defaultPaginationSize } from '../BaseTable'

// pagination methods

export const paginateData = (data: any[], offset: number = 0, limit: number = defaultPaginationSize) => {
	return data.slice(offset, offset + limit);
}
