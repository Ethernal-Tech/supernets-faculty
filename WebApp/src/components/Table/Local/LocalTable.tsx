import { useCallback, useMemo, useState } from "react";
import { BaseColumnModel, BaseTable } from "../BaseTable";
import { paginateData } from "./helpers";

export class GenericSortModel {
    property?: string;
    isAsc!: boolean;

    constructor(data?: GenericSortModel) {
        if (data) {
			this.property = data.property;
			this.isAsc = data.isAsc;
        }
    }
}

export type LocalTableProps = {
	columns: BaseColumnModel[]
	data: any[]
	limit?: number
	rowSelectionChanged?: (data: any[], selectedRows: Tabulator.RowComponent[]) => void
	cellEdited?: (cell: any) => void
	isLoading?: boolean
	options?: any
	hasPagination?: boolean
	compact?: boolean
}

export const LocalTable = ({
	columns,
	data,
	limit,
	rowSelectionChanged,
	cellEdited,
	isLoading,
	options,
	hasPagination,
	compact
}: LocalTableProps) => {
	const [offset, setOffset] = useState(0);
	const [rowsData, setRowsData] = useState<any[]>([]);

	const convertedColumns: BaseColumnModel[] = useMemo(
		() => {
			return columns.reduce(
				(result: BaseColumnModel[], column) => {
					if (column.visible) {
						const item: BaseColumnModel = {
							...column
						}

						result.push(item)
					}

					return result;
				},
				[]
			)
		},
		[columns]
	)

	const pagination = useMemo(
		() => {
			if (!hasPagination) {
				return undefined;
			}

			return {
				offset,
				limit,
				count: data.length,
				onChange: setOffset
			}
		},
		[hasPagination, offset, limit, data.length]
	)

	const fetchDataCallback = useCallback(
		async () => {
			const paginatedData = hasPagination ? paginateData(data, offset, limit) : data;

			// added setTimeout because Tabulator has issue (not showing data, only header) when it reseives data while not in DOM yet
			// and used this way it works, but maybe there is some better solution
			const promise = new Promise<void>((resolve) => {
				setTimeout(() => {
					setRowsData(paginatedData)
					resolve();
				}, 1)
			});

			return promise;
		},
		[data, limit, offset, hasPagination]
	)

	return (
		<BaseTable
			fetchFunction={fetchDataCallback}
			isLoading={!!isLoading}
			columns={convertedColumns}
			rowsData={rowsData}
			pagination={pagination}
			rowSelectionChanged={rowSelectionChanged}
			options={options}
			cellEdited={cellEdited}
			compact={compact}
		/>
	)
}
