import { ReactTabulator } from 'react-tabulator';
import { ColumnContainer } from 'components/Layout';
import Pagination from './Pagination/Pagination';
import { useMemo, useRef } from 'react';
import { BaseColumnModel, TabulatorColumnModel } from './BaseColumnModel';
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css';
import './tabulator-override.scss';
import WithFetch from 'features/Fetch/WithFetch';

export const defaultPaginationSize = 20;

const defaultOptions = {
	layout: 'fitColumns',
	movableColumns: true,
	selectable: 1,
	tooltips: true
}

type Props = {
	fetchFunction: () => Promise<any>
	isLoading: boolean
	columns: BaseColumnModel[]
	rowsData: any[]
	pagination?: {
		offset?: number // starting index
		limit?: number // max number of rows
		count: number // length of all items
		onChange: (offset: number) => void
	}

	rowSelectionChanged?: (data: any[], selectedRows: Tabulator.RowComponent[]) => void
	cellEdited?: (cell: any) => void

	options?: any
	compact?: boolean
}

export const BaseTable = ({
	fetchFunction, isLoading, columns, rowsData, pagination, rowSelectionChanged, cellEdited, options, compact
}: Props) => {
	const tabulatorRef = useRef<ReactTabulator>(null);

	const columnsConverted: TabulatorColumnModel[]= useMemo(
		() => {
			return columns.map(
				(column) => {
					const convertedColumn: TabulatorColumnModel = {
						...column,
						headerSort: false
					}

					return convertedColumn;
				}
			)
		},
		[columns]
	)

	const customOptions = useMemo(
		() => {
			return {
				...defaultOptions,
				...options
			}
		},
		[options]
	)

	return (
		<WithFetch fetchFunction={fetchFunction} refetching={isLoading}>
			<ColumnContainer margin='small'>
				<ReactTabulator
					ref={tabulatorRef}
					columns={columnsConverted}
					data={rowsData}
					rowSelectionChanged={rowSelectionChanged}
					options={customOptions}
					cellEdited={cellEdited}
				/>
				{pagination &&
					<Pagination
						offset={pagination.offset || 0}
						limit={pagination.limit || defaultPaginationSize}
						count={pagination.count}
						onChange={pagination.onChange}
						compact={compact}
					/>
				}
			</ColumnContainer>
		</WithFetch>
	)
}
