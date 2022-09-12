import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Pagination from 'components/Pagination'
import StudentRow from '../../RowComponents/StudentRow'
import { addStudentAction, deleteStudentAction } from 'actions/userActions'
import { listStyles } from '../../../styles'
import { isEventAdmin } from 'utils/userUtils'
import { emptyArray, noop } from 'pages/commonHelper'
import { ContentShell } from 'features/Content';
import { Dialog } from 'components/Dialog'
import { UserForm } from '../UserForm'

const keys = ["firstName", "lastName", "id"]

export const StudentList = () => {
	const dispatch = useDispatch();
	const state = useSelector((state: any) => state);
	const isAdmin = isEventAdmin(state);
	const students = state.users.students || emptyArray
	const selectedAccount = state.eth.selectedAccount
	const selectedEvent = state.event.selectedEvent

    const [query, setQuery] = useState('');
    const [allStudents, setAllStudents] = useState([]);
    const [searchedStudents, setSearchedStudents] = useState([]);

	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const openDialogCallback = useCallback(
		() => setIsDialogOpen(true),
		[]
	)

	const closeDialogCallback = useCallback(
		() => setIsDialogOpen(false),
		[]
	)

    useEffect(
		() => {
	        let tempList = students
	        setAllStudents(tempList)
	        setSearchedStudents(search(tempList, query))
		},
		[students]
	)

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

    const onSubmit = useCallback(
		async (ad, fn, ln, cn, _) => {
			addStudentAction(ad, fn, ln, cn, selectedEvent.id, selectedAccount, dispatch)
		},
		[selectedEvent, selectedAccount, dispatch]
	)

    const onQueryChange = useCallback(
		({target}) => {
	        let newStudents = search(allStudents, target.value)

	        setQuery(target.value)
	        setSearchedStudents(newStudents)
		},
		[allStudents, search]
	)

    const onDelete = useCallback(
		async(studId) => {
			await deleteStudentAction(studId, selectedEvent.id, selectedAccount, dispatch)
		},
		[selectedEvent, selectedAccount, dispatch]
	)

    return (
        <ContentShell title='Students'>
            <input type="text"
                id="query"
                placeholder='Search...'
                className="search"
                onChange={onQueryChange}/>

            <Container>
                <Row style={listStyles.borderBottom}>
                    <Col>Name</Col>
                    <Col>Address</Col>
                    <Col xs={"auto"}> </Col>
                    <Col xs={"auto"}> </Col>
                </Row>
                <Pagination
                    data={searchedStudents}
                    RenderComponent={StudentRow}
                    func={onDelete}
                    pageLimit={5}
					dataLimit={5}
					func1={noop}
					isAdmin={undefined}
                />
            </Container>
			{isAdmin &&
				<Dialog
					title='Add Student'
					onClose={closeDialogCallback}
					open={isDialogOpen}
				>
                	<UserForm
						onSubmit={onSubmit}
						onCancel={closeDialogCallback}
					/>
				</Dialog>
            }
        </ContentShell>
    )
}
