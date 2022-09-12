import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import AddUserComponent from 'components/AddUserComponent'
import Pagination from 'components/Pagination'
import ProfessorRow from '../../RowComponents/ProfessorRow'
import { addProfessorAction, deleteProfessorAction } from 'actions/userActions'
import { listStyles } from '../../../styles'
import { isEventAdmin } from 'utils/userUtils'
import { emptyArray } from 'pages/commonHelper'

const keys = ["firstName", "lastName", "id"]

export const ProfessorList = () => {
	const dispatch = useDispatch();
	const state = useSelector((state: any) => state);
	const isAdmin = isEventAdmin(state);
	const professors = state.users.professors || emptyArray;
    const selectedAccount = state.eth.selectedAccount;
    const selectedEvent = state.event.selectedEvent;

    const [query, setQuery] = useState('');
    const [allProfessors, setAllProfessors] = useState([]);
    const [searchedProfessors, setSearchedProfessors] = useState([]);

    const search = useCallback(
		(data, query) => {
	        if (query !== '') {
	            let filteredData = data
	            let multiQuery = query.split(' ')
	            multiQuery.forEach(mq => { if (mq === '') return
	                filteredData = filteredData.filter(item => keys.some(key => item[key].toLowerCase().includes(mq.toLowerCase())))
	            })

	            return filteredData
	        }

	        return data
		},
		[]
	)

    useEffect(
		() => {
	        let tempList = professors
	        setAllProfessors(tempList)
	        setSearchedProfessors(search(tempList, query))
		},
		[professors]
	)

	const onSubmit = useCallback(
		async (ad, fn, ln, cn, ex) => {
			addProfessorAction(ad, fn, ln, cn, ex, selectedEvent, selectedAccount, dispatch)
		},
		[selectedAccount, dispatch, selectedEvent]
	)

    const onQueryChange = useCallback(
		({target}) => {
	        let newProfessors = search(allProfessors, target.value)

	        setQuery(target.value)
	        setSearchedProfessors(newProfessors)
		},
		[allProfessors, search]
	)

    const onDelete = useCallback(
		async(profId) => {
			await deleteProfessorAction(profId, selectedEvent.id, selectedAccount, dispatch)
		},
		[selectedEvent, selectedAccount, dispatch]
	)

    return (
        <div style={{ padding: '1rem' }}>
            <h4>Professors</h4>

            <input type="text"
                id="query"
                placeholder='Search...'
                className="search"
                onChange={onQueryChange}
			/>

            <Container>
                <Row style={listStyles.borderBottom}>
                    <Col>Name</Col>
                    <Col>Address</Col>
                    <Col xs={"auto"}> </Col>
                    <Col xs={"auto"}> </Col>
                </Row>
                <Pagination
                    data={searchedProfessors}
                    RenderComponent={ProfessorRow}
                    func={onDelete}
                    pageLimit={5}
                    dataLimit={5}
                />
            </Container>
            {isAdmin &&
                <AddUserComponent onSubmit={onSubmit} />
            }
        </div>
    )
}