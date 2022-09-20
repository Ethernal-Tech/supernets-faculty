import { useCallback, useEffect, useMemo, useState } from 'react';
import { Spinner, ClipSpinner } from 'components/Spinner';
import styles from './withFetch.module.scss'

type Props = {
	children: any
	fetchFunction(): Promise<any>
	text?: string
	size?: 40 | 70
	// use when fetch is triggered again, and this boolean must be controlled by parent component
	refetching?: boolean
}

const WithFetch = ({ children, fetchFunction, text, size = 70, refetching }: Props) => {
	const [fetching, setFetching] = useState(true);

	const fetchData = useCallback(
		async () => {
			setFetching(true);
			await fetchFunction();
			setFetching(false);
		},
		[fetchFunction]
	)

	useEffect(
		() => {
			fetchData();
		},
		[fetchData]
	)

	const content = useMemo(
		() => {
			if (fetching) {
				return (
					<Spinner text={text}>
						<ClipSpinner size={size} />
					</Spinner>
				)
			} else {
				return <>{children}</>
			}
		},
		[fetching, text, size, children]
	)

    return (
		<div style={{ position: 'relative' }}>
			{content}
			{(!fetching && refetching) &&
				<div className={styles.container}>
					<Spinner>
						<ClipSpinner size={size} />
					</Spinner>
				</div>
			}
		</div>
	)
}

export default WithFetch;
