import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { listStyles } from '../../styles'
import EventListenerService from "../../utils/eventListenerService"
import { enrollStudentsToCourseAction } from '../../actions/coursesActions'
import LoadingSpinner from '../../components/LoadingSpinner'
import { generalStyles } from '../../styles'

class EnrollStudentsList extends React.Component {
    state = {
        isWorking: false,
        allChecked: false,
        studentsToEnroll: [],
        selectedStudents: [],
    }

    componentDidMount() {
        this.setState({ studentsToEnroll: this.props.studentsToEnroll.slice().map(stud => ({...stud, selected: false})) })
    }

    onCheckAll(e) {
        let tempList = this.state.studentsToEnroll;
        tempList.map(user => (user.selected = e.target.checked));

        this.setState({ 
            allChecked: e.target.checked, 
            studentsToEnroll: tempList, 
            selectedStudents: this.state.studentsToEnroll.filter((e) => e.selected) 
        });
    }

    onItemCheck(e, item) {
        let tempList = this.state.studentsToEnroll;
        tempList.map((stud) => {
            if (stud.id === item.id) {
                stud.selected = e.target.checked;
            }
            return stud;
        });

        //To Control Master Checkbox State
        const totalItems = this.state.studentsToEnroll.length;
        const totalCheckedItems = tempList.filter((e) => e.selected).length;

        // Update State
        this.setState({
            allChecked: totalItems === totalCheckedItems,
            studentsToEnroll: tempList,
            selectedStudents: this.state.studentsToEnroll.filter((e) => e.selected),
        });
    }

    enrollStudents = async() => {
        if (this.state.selectedStudents.length != 0){
            this.setState({ isWorking: true })
            debugger
            const studentAddrs = this.state.selectedStudents.map(stud => stud.id)
            await this.props.enrollStudentsToCourse(this.props.courseId, studentAddrs, this.props.selectedAccount, this.props.eventId)
            this.setState({ isWorking: false, allChecked: false , studentsToEnroll: this.props.studentsToEnroll.slice().map(stud => ({...stud, selected: false})), selectedStudents: []})
        }
        else {
            EventListenerService.notify("error", 'fields not populated!')
        }
    }

    render() {
        const { course, courseStudents } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>{course.name}</h4>
                
                <Container>
                    <Row style={listStyles.borderBottom}>
                        <Col xs={'auto'}>
                            <input
                                type="checkbox" className="form-check-input"
                                checked={this.state.allChecked}
                                id="checkAll"
                                onChange={(e) => this.onCheckAll(e)}
                            />
                        </Col>
                        <Col>Student name</Col>
                        <Col>Student address</Col>
                    </Row>
{/* style={ind === courseStudents.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }} */}
                    {
                        this.state.studentsToEnroll.map((student, ind) => (
                            <Row key={`stud_${student.id}`} >
                                <Col>
                                    <input
                                        type="checkbox"
                                        checked={student.selected}
                                        className="form-check-input"
                                        id={student.id}
                                        onChange={(e) => this.onItemCheck(e, student)}
                                    />
                                </Col>
                                <Col>
                                    <Link to={`/student?stud=${student.id}`}>{student.firstName} {student.lastName}</Link>
                                </Col>
                                <Col>{student.id}</Col>
                            </Row>
                        ))
                    }
                </Container>
                {
                    this.state.isWorking ?
                    <Button variant="primary" type="submit" style={generalStyles.button} disabled><LoadingSpinner/></Button> :
                    <Button className="btn btn-primary" onClick={this.enrollStudents} disabled={this.state.selectedStudents.length === 0}>Enroll {this.state.selectedStudents.length} students</Button>
                }
                
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const allStudents = (state.users.students || [])
    const studentsToEnroll = allStudents.filter(stud => !ownProps.course.students.some(y => y === stud.id))
    return {
        studentsToEnroll,
        courseId: ownProps.course.id,
        eventId: state.event.selectedEvent.eventId
    }
}

const mapDispatchToProps = dispatch => ({
    enrollStudentsToCourse: (courseId, studentAddrs, selectedAccount, eventId) => enrollStudentsToCourseAction(courseId, studentAddrs, selectedAccount, eventId, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(EnrollStudentsList)