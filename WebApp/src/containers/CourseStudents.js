import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { listStyles } from '../styles'
import { contractToGrade }  from '../utils/userUtils'

class CourseStudents extends React.Component {
    state = {
        updatedGradesByStudent: {}
    }

    onEnroll = async studentAddr => this.props.enrollStudentToCourse(this.props.course.id, studentAddr, this.props.selectedAccount)

    render() {
        const { course, courseStudents, gradesByStudent } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>{course.name}</h4>
                
                <Container>
                    <Row style={listStyles.borderBottom}>
                        <Col>Student</Col>
                        <Col>Student address</Col>
                        <Col xs={'auto'}>Grade</Col>
                    </Row>

                    {
                        courseStudents.map((student, ind) => (
                            <Row key={`stud_${student.id}`} style={ind === courseStudents.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                                <Col>
                                    <Link to={`/student?stud=${student.id}`}>{student.firstName} {student.lastName}</Link>
                                </Col>
                                <Col>{student.id}</Col>
                                <Col xs={'auto'}>
                                    {
                                        contractToGrade.get(gradesByStudent.find(x => x.studentId === student.id).grade)
                                    }
                                </Col>
                            </Row>
                        ))
                    }
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const allStudents = (state.users.students || [])
    const courseStudents = ownProps.course.students.map(courseStud => allStudents.find(stud => stud.id === courseStud))
    const gradesByStudent = (state.courses.gradesByStudentByCourse || {})[ownProps.course.id] || {}

    return {
        courseStudents: courseStudents,
        gradesByStudent,
    }
}


export default connect(mapStateToProps)(CourseStudents)