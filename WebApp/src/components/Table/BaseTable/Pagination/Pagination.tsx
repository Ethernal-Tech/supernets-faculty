import { Button } from 'components/Button';
import { RowContainer } from 'components/Layout';
import { useCallback, useMemo } from 'react';
import { noop } from 'utils/commonHelper';

type Props = {
	offset: number
	limit: number
	count: number
	onChange: (offset: number) => void
	compact?: boolean
}

const Pagination = ({ offset, limit, count, onChange, compact }: Props) => {
	const firstPageCallback = useCallback(
		() => {
			onChange(0);
		},
		[onChange]
	)

	const lastPageCallback = useCallback(
		() => {
			onChange(Math.floor((count - 1) / limit) * limit);
		},
		[onChange, count, limit]
	)

	const nextPageCallback = useCallback(
		() => {
			onChange(offset + limit);
		},
		[onChange, offset, limit]
	)

	const prevPageCallback = useCallback(
		() => {
			onChange(offset - limit);
		},
		[onChange, offset, limit]
	)

	const currentPage = useMemo(
		() => Math.ceil((offset + 1) / limit),
		[offset, limit],
	)

	// in compact mode, if there is only one page, do not show pagination
	if (compact && count <= limit) {
		return <></>
	}

	return (
		<RowContainer justifyContent='flex-end'>
			<Button
				text='<<'
				onClick={firstPageCallback}
				disabled={offset === 0}
			/>
			<Button
				text='<'
				onClick={prevPageCallback}
				disabled={offset === 0}
			/>
			<Button
				text={currentPage.toString()}
				onClick={noop}
			/>
			<Button
				text='>'
				onClick={nextPageCallback}
				disabled={offset + limit >= count}
			/>
			<Button
				text='>>'
				onClick={lastPageCallback}
				disabled={offset + limit >= count}
			/>
		</RowContainer>
	)
}

export default Pagination;
