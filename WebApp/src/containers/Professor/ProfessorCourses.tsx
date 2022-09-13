import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { isEventAdmin } from 'utils/userUtils'
import { addCourseAction, deleteCourseAction, loadProfessorCoursesAction } from 'actions/coursesActions'
import { listStyles } from '../../styles'
import AddCourseComponent from 'components/AddCourseComponent'
import Pagination from 'components/Pagination'
import ProfessorCourseRow from '../RowComponents/ProfessorCourseRow'
import { noop } from 'utils/commonHelper'
import { ContentShell } from 'features/Content';

const keys = ["title"] // course.title

export const ProfessorCourses = ({ professor, userRole, selectedAccount }) => {
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const professorAddr = professor?.id
    const allCourses = state.courses.allCourses || []
    const professorCoursesIds = (professorAddr ? state.courses.coursesByProfessorAddr[professorAddr] : undefined) || []
    const coursesProps = allCourses.filter(x => professorCoursesIds.some(y => y === x.id))
    const isAdmin = isEventAdmin(state)
	const selectedEvent = state.event.selectedEvent

    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [searchedCourses, setSearchedCourses] = useState([]);

    useEffect(
		() => {
			loadProfessorCoursesAction(professor.id, selectedEvent.id, dispatch)
		},
		[]
	);

    useEffect(
		() => {
	        let temp = coursesProps
	        setCourses(temp)
	        setSearchedCourses(search(temp, query))
		},
		[coursesProps]
	);

    const onQueryChange = ({target}) => {
        let newCourses = search(courses, target.value)

        setQuery(target.value)
        setSearchedCourses(newCourses)
    }

    const search = (data, query) => {
        return data.filter(item => keys.some(key => item[key].toLowerCase().includes(query.toLowerCase())))
    }

    const onSubmit = async (title, description, startTime, venue, points) => {
		addCourseAction(title, description, startTime, venue, points, professor.id, selectedEvent.id, selectedAccount, dispatch)
	}

	const onDeleteCourse = async (courseId) => {
		deleteCourseAction(courseId, selectedEvent.id, professor.id, selectedAccount, dispatch)
	}

    return (
        <ContentShell title={professor.name}>
            <input type="text"
                id="query"
                placeholder='Search...'
                className="search"
                onChange={onQueryChange}/>

            <Container>
                <Row style={listStyles.borderBottom}>
                    <Col>Course name</Col>
                    <Col>Number of students</Col>
                    { isAdmin && <Col></Col> }
                </Row>
                <Pagination
                    data={searchedCourses}
                    RenderComponent={ProfessorCourseRow}
                    func={onDeleteCourse}
                    pageLimit={5}
                    dataLimit={5}
					isAdmin={isAdmin}
					func1={noop}
                />
            </Container>
            {isAdmin &&
                <>
                    <h4>Add new course</h4>
                    <AddCourseComponent onSubmit={onSubmit} />
                </>
            }
        </ContentShell>
    )
}
