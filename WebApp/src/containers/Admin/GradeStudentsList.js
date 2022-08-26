import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { listStyles } from '../../styles'
import EventListenerService from "../../utils/eventListenerService"
import { gradeStudentsAction } from '../../actions/coursesActions'
import LoadingSpinner from '../../components/LoadingSpinner'
import { generalStyles } from '../../styles'
import { gradeToContract } from '../../utils/userUtils'

class GradeStudentsList extends React.Component {
    state = {
        isWorking: false,
        studentGrades: {},
    }

    gradeChanged = (e) => {
        let newGrades = this.state.studentGrades

        if (e.target.value == 0) {
            // const removeProperty = dyProps => ({ [dyProps]: _, ...rest }) => rest;



            delete newGrades[e.target.id]
            // newGrades.delete(e.target.id)
        } else {
            newGrades[e.target.id] = e.target.value
        }

        this.setState({studentGrades: newGrades})
    }

    gradeStudents = async() => {
        if (Object.keys(this.state.studentGrades).length !== 0) {
            this.setState({isWorking: true})
            await this.props.gradeStudents(this.props.courseId, this.state.studentGrades, this.props.selectedAccount, this.props.eventId)
            this.setState({isWorking: false, studentGrades: {}})
        } else {
            EventListenerService.notify("error", 'fields not populated!')
        }
    }
    
    render() {
        const { course, studentsToGrade } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>{course.name}</h4>

                {/* <input type="text"
                    id="query"
                    placeholder='Search...'
                    className="search"
                    onChange={this.onChange}/>
                 */}
                <Container>
                    <Row style={listStyles.borderBottom}>
                        <Col>Student name</Col>
                        <Col>Student address</Col>
                        <Col xs={'auto'}>Grade</Col>
                    </Row>
                    {
                        studentsToGrade.map((student) => (
                            <Row key={`stud_${student.id}`} >
                                <Col>
                                    <Link to={`/student?stud=${student.id}`}>{student.firstName} {student.lastName}</Link>
                                </Col>
                                <Col>{student.id}</Col>
                                <Col>
                                    <select name="grade" id={student.id} onChange={this.gradeChanged}>
                                        {gradeToContract.map((grade, key) => 
                                        {
                                            return <option key={key} value={grade.contractGrade}>{grade.grade}</option>
                                        })}
                                    </select>
                                </Col>
                            </Row>
                        ))
                    }
                </Container>
                {
                    this.state.isWorking ?
                    <Button variant="primary" type="submit" style={generalStyles.button} disabled><LoadingSpinner/></Button> :
                    <Button className="btn btn-primary" onClick={this.gradeStudents} disabled={Object.keys(this.state.studentGrades).length === 0}>Grade students</Button>
                }

            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const allStudents = (state.users.students || [])
    const studentGrades = state.courses.gradesByStudentByCourse[ownProps.course.id]
    const studentsToGrade = allStudents.filter(stud => studentGrades.filter(sg => sg.grade > 5).some(fs => fs.studentId === stud.id))
    return {
        selectedAccount: state.eth.selectedAccount,
        studentsToGrade,
        courseId: ownProps.course.id,
        eventId: state.event.selectedEvent.eventId
    }
}

const mapDispatchToProps = dispatch => ({
    gradeStudents: (courseId, studentGrades, selectedAccount, eventId) => gradeStudentsAction(courseId, studentGrades, selectedAccount, eventId, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(GradeStudentsList)