import React from 'react'
import '../../listStyles.css'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { addCourseAction, loadProfessorCoursesAction } from '../../actions/coursesActions'
import { listStyles } from '../../styles'
import { USER_ROLES } from '../../utils/constants'
import AddCourseComponent from '../../components/AddCourseComponent'

class ProfessorCourses extends React.Component {
    componentDidMount() {
        const { professor, loadProfessorCourses } = this.props
        loadProfessorCourses(professor.id, this.props.selectedEvent.eventId)
    }

    onSubmit = async (title, description, startTime, endTime, venue) => 
         this.props.addCourse(title, description, startTime, endTime, venue, this.props.professor.id, this.props.selectedEvent.eventId, this.props.selectedAccount)
    

    render() {
        const { professor, courses, userRole } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>{professor.name}</h4>
                
                <Container>
                    <Row style={listStyles.borderBottom}>
                        <Col>Course name</Col>
                        <Col>Number of students</Col>
                    </Row>

                    {
                        courses.map((course, ind) => (
                            <Row key={`course_${course.id}`} style={ind === courses.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                                <Col><Link to={`/course?courseId=${course.id}`}>{course.title}</Link></Col>
                                <Col>{course.students.length}</Col>
                            </Row>
                        ))
                    }
                </Container>
                {
                    userRole === USER_ROLES.ADMIN &&
                    <AddCourseComponent onSubmit={this.onSubmit} />
                }
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const professorAddr = ownProps.professor?.id
    const allCourses = state.courses.allCourses || []
    const professorCoursesIds = (professorAddr ? state.courses.coursesByProfessorAddr[professorAddr] : undefined) || []
    const courses = allCourses.filter(x => professorCoursesIds.some(y => y === x.id))
    
    return {
        courses,
        selectedEvent: state.event.selectedEvent,
    }
}

const mapDispatchToProps = dispatch => ({
    loadProfessorCourses: (professorAddr, eventId) => loadProfessorCoursesAction(professorAddr, eventId, dispatch),
    addCourse: (title, description, startTime, endTime, venue, professorAddr, eventId, selectedAccount) => addCourseAction(title, description, startTime, endTime, venue, professorAddr, eventId, selectedAccount, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorCourses)