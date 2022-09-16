import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// A custom hook that builds on useLocation to parse the query string
export const useQuery = () => {
	const { search } = useLocation();

	const searchAsObject = useMemo(
		() => Object.fromEntries(new URLSearchParams(search)),
		[search]
	)

	return searchAsObject;
}
