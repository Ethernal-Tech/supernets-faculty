import React, { useEffect, useState } from 'react'
import '../../listStyles.css'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { isEventAdmin } from '../../utils/userUtils'
import { addCourseAction, loadProfessorCoursesAction } from '../../actions/coursesActions'
import { listStyles } from '../../styles'
import AddCourseComponent from '../../components/AddCourseComponent'
import Pagination from '../../components/Pagination'
import ProfessorCourseRow from '../../components/ProfessorCourseRow'

function ProfessorCourses(props) {

    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [searchedCourses, setSearchedCourses] = useState([]);

    useEffect(() => {
        props.loadProfessorCourses(props.professor.id, props.selectedEvent.eventId)

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

    const onSubmit = async (title, description, startTime, endTime, venue, points) => 
         props.addCourse(title, description, startTime, endTime, venue, props.professor.id, points, props.selectedEvent.eventId, props.selectedAccount)

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
                </Row>
                <Pagination 
                    data={searchedCourses}
                    RenderComponent={ProfessorCourseRow}
                    pageLimit={5}
                    dataLimit={5}
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
    addCourse: (title, description, startTime, endTime, venue, professorAddr, points, eventId, selectedAccount) => addCourseAction(title, description, startTime, endTime, venue, professorAddr, points, eventId, selectedAccount, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorCourses)