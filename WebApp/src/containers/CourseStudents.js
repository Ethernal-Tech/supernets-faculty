import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { listStyles } from '../styles'
import EnrollStudentToCourseComponent from '../components/EnrollStudentToCourseComponent'
import { USER_ROLES } from '../utils/constants'
import EventListenerService from "../utils/eventListenerService"
import { gradeStudentsAction } from '../actions/coursesActions'
import { isStringValueAnInt } from '../utils/utils'
import LoadingSpinner from '../components/LoadingSpinner'

class CourseStudents extends React.Component {
    state = {
        updatedGradesByStudent: {}
    }

    onEnroll = async studentAddr => this.props.enrollStudentToCourse(this.props.course.id, studentAddr, this.props.selectedAccount)

    render() {
        const { userRole, course, courseStudents, studentIdToInd, studentsToEnroll, gradesByStudent } = this.props
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
                                        gradesByStudent[student.id]
                                        // userRole !== USER_ROLES.PROFESSOR || parseInt(gradesByStudent[student.id] || '5') > 5
                                        //     ? (gradesByStudent[student.id] || '')
                                        //     : (
                                        //         <Form onSubmit={evt => this.onStudentGradeChangeSubmit(student.id, evt)}>
                                        //             {
                                        //                 this.state.isWorking
                                        //                     ?
                                        //                     <LoadingSpinner />
                                        //                     :
                                        //                     <Form.Control
                                        //                         style={{ maxWidth: '70px', textAlign: 'right', height: '26px' }}
                                        //                         type="text"
                                        //                         value={this.state.updatedGradesByStudent[student.id] !== undefined ? this.state.updatedGradesByStudent[student.id] : gradesByStudent[student.id] || ''}
                                        //                         onChange={evt => this.onStudentGradeChange(student.id, evt)}
                                        //                         onKeyDown={evt => this.onStudentGradeChangeKeyDown(student.id, evt)}
                                        //                     />
                                        //             }
                                        //         </Form>
                                        //     )
                                    }
                                </Col>
                            </Row>
                        ))
                    }
                </Container>
                {/* {
                    userRole === USER_ROLES.ADMIN &&
                    <EnrollStudentToCourseComponent onSubmit={this.onEnroll} studentsToEnroll={studentsToEnroll}/>
                } */}
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

const mapDispatchToProps = dispatch => ({
    //gradeStudent: (courseId, studentAddr, grade, selectedAccount) => gradeStudentAction(courseId, studentAddr, grade, selectedAccount, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseStudents)


// onStudentGradeChange = (studentId, evt) => this.setState({
//     updatedGradesByStudent: { ...this.state.updatedGradesByStudent, [studentId]: evt.target.value }
// })

// onStudentGradeChangeKeyDown = (studentId, evt) => {
//     if (evt.key === 'Escape') {
//         this.setState({
//             updatedGradesByStudent: { ...this.state.updatedGradesByStudent, [studentId]: undefined }
//         }, () => evt.target.blur())
        
//     } 
// }

// onStudentGradeChangeSubmit = async (studentId, evt) => {
//     evt.preventDefault()

//     const oldGrade = this.props.gradesByStudent[studentId]
//     const updatedGrade = this.state.updatedGradesByStudent[studentId]
//     if (updatedGrade === oldGrade) {
//         return
//     }

//     if (!updatedGrade) {
//         EventListenerService.notify("error", 'fields not populated!')
//         return
//     } else if (!isStringValueAnInt(updatedGrade)) {
//         EventListenerService.notify("error", 'invalid value!')
//         return
//     }

//     const value = parseInt(updatedGrade)
//     if (value < 5 || value > 10) {
//         EventListenerService.notify("error", 'invalid value!')
//         return
//     }

//     this.setState({ isWorking: true })
//     await this.props.gradeStudent(this.props.course.id, studentId, updatedGrade, this.props.selectedAccount)
//     this.setState({ updatedGradesByStudent: {}, isWorking: false })
// }