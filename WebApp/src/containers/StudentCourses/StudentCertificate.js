import React from 'react'
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { loadStudentCoursesAction } from 'actions/coursesActions'
import { listStyles } from '../../styles'
import { formatDate } from 'utils/utils'
import { emptyArray, emptyObject } from 'utils/commonHelper'

class StudentCertificate extends React.Component {
    constructor(props) {
        super(props)
        const now = new Date()
        this.dateNow = formatDate(now)
    }

    componentDidMount() {
		// TODO: selectedEvent is not existing anymore
        this.props.loadStudentCourses(this.props.student.id, this.props.selectedEvent.id)
    }

    render() {
        const { student, studentCourses } = this.props
        return (
            <div style={{ padding: '20px' }}>
                <h4>Official certificated made in blockchain</h4>
                <div style={{position: 'fixed', bottom: '10px', left: '20px', zIndex: '20'}}>
                    <img src={`${process.env.PUBLIC_URL}/logoplan.png`} height={45} alt="logoplan" />
                </div>
                <Container>
                    <Row style={listStyles.paddingTop10}>Issued to: {student.name}</Row>
                    <Row>Issued by: Faculty of Blockchain</Row>
                    <Row>Event type: PlanB Summer School</Row>
                    <Row>Location: Lugano</Row>
                    <Row>Date: {this.dateNow}</Row>

                    <Row style={{ ...listStyles.borderBottom, ...listStyles.paddingTop10 }}>
                        <Col>Course Name</Col>
                        <Col>Professor's Name</Col>
                        <Col>Grade</Col>
                    </Row>
                    {
                        studentCourses.map((course, ind) => (
                            <Row
                                key={`course_${ind}`}
                                style={ind === studentCourses.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                                <Col>{course.name}</Col>
                                <Col>{course.professorName}</Col>
                                <Col>{course.grade}</Col>
                            </Row>
                        ))
                    }
                </Container>
            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    const allCourses = state.courses.allCourses || emptyArray
    const gradesByCourse = (state.courses.gradesByCourseByStudent || emptyObject)[ownProps.student.id] || emptyObject
    const studentCourses = ((state.courses.studentCourses || emptyObject)[ownProps.student.id] || emptyArray).map(x => {
        const course = allCourses.find(y => y.id === x)
        const grade = gradesByCourse[x]
        return {
            ...course,
            grade
        }
    }).filter(x => parseInt(x.grade) > 5)
    return {
        studentCourses,
        selectedEvent: state.event.selectedEvent,
    }
}

const mapDispatchToProps = dispatch => ({
    loadStudentCourses: (accountAddress, eventId) => loadStudentCoursesAction(accountAddress, eventId, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentCertificate)
