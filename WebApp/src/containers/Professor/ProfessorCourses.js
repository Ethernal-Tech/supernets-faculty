import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { isEventAdmin } from '../../utils/userUtils'
import { addCourseAction, deleteCourseAction, loadProfessorCoursesAction } from '../../actions/coursesActions'
import { listStyles } from '../../styles'
import AddCourseComponent from '../../components/AddCourseComponent'
import Pagination from '../../components/Pagination'
import ProfessorCourseRow from '../RowComponents/ProfessorCourseRow'

function ProfessorCourses(props) {

    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [searchedCourses, setSearchedCourses] = useState([]);

    useEffect(() => {
        props.loadProfessorCourses(props.professor.id, props.selectedEvent.id)
    }, []);

    useEffect(() => {
        let temp = props.courses
        setCourses(temp)
        setSearchedCourses(search(temp, query))
    }, [props.courses]);

    const onQueryChange = ({target}) => {
        let newCourses = search(courses, target.value)

        setQuery(target.value)
        setSearchedCourses(newCourses)
    }

    const keys = ["title"] // course.title
    const search = (data, query) => {
        return data.filter(item => keys.some(key => item[key].toLowerCase().includes(query.toLowerCase())))
    }

    const onSubmit = async (title, description, startTime, venue, points) =>
        props.addCourse(title, description, startTime, venue, points, props.professor.id, props.selectedEvent.id, props.selectedAccount)

    const onDeleteCourse = async (courseId) =>
        props.deleteCourse(courseId, props.selectedEvent.id, props.professor.id, props.selectedAccount)

    const { professor, isAdmin } = props
    return (
        <div style={{ padding: '1rem' }}>
            <h4>{professor.name}</h4>
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
                />
            </Container>
            {
                isAdmin &&
                <>
                    <h4>Add new course</h4>
                    <AddCourseComponent onSubmit={onSubmit} />
                </>
            }
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    const professorAddr = ownProps.professor?.id
    const allCourses = state.courses.allCourses || []
    const professorCoursesIds = (professorAddr ? state.courses.coursesByProfessorAddr[professorAddr] : undefined) || []
    const courses = allCourses.filter(x => professorCoursesIds.some(y => y === x.id))
    const isAdmin = isEventAdmin(state)

    return {
        courses,
        selectedEvent: state.event.selectedEvent,
        isAdmin,
    }
}

const mapDispatchToProps = dispatch => ({
    loadProfessorCourses: (professorAddr, eventId) => loadProfessorCoursesAction(professorAddr, eventId, dispatch),
    addCourse: (title, description, startTime, venue, professorAddr, points, eventId, selectedAccount) => addCourseAction(title, description, startTime, venue, professorAddr, points, eventId, selectedAccount, dispatch),
    deleteCourse: (courseId, eventId, professorAddr, selectedAccount) => deleteCourseAction(courseId, eventId, professorAddr, selectedAccount, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorCourses)
