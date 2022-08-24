import React from 'react'
import '../../listStyles.css'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import AddUserComponent from '../../components/AddUserComponent'
import { addStudentAction, setSelectedUserAction } from '../../actions/userActions'
import { listStyles } from '../../styles'
import { isUserAdmin } from '../../utils/userUtils'

class StudentList extends React.Component {
    onSubmit = async (name, addr) => this.props.addStudent(name, addr, this.props.selectedEvent.eventId, this.props.selectedAccount)

    onEventClick(e, props, student){
        props.setSelectedUser(student)
    }

    render() {
        const { students } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>Students</h4>
                
                <Container>
                    <Row style={listStyles.borderBottom}>
                        <Col>Name</Col>
                        <Col>Address</Col>
                    </Row>
                    {
                        students.map((student, ind) => (                           
                            <Row key={`stud_${student.id}`} style={ind === students.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                                <Col><Link to={`/student?stud=${ind}`}>{student.firstName}</Link></Col>
                                <Col>{student.id}</Col>
                                <Col><Link className="btn btn-primary" to={'/editUser'} onClick={e => this.onEventClick(e, this.props, student)}>Edit</Link></Col>
                            </Row>
                        ))
                    }
                </Container>
                {
                    this.props.isAdmin &&
                    <AddUserComponent onSubmit={this.onSubmit} />
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    const isAdmin = isUserAdmin(state)
    return {
        students: state.users.students || [],
        selectedAccount: state.eth.selectedAccount,
        selectedEvent: state.event.selectedEvent,
        isAdmin,
    }
}

const mapDispatchToProps = dispatch => ({
    addStudent: (name, addr, eventId, selectedAccount) => addStudentAction(name, addr, eventId, selectedAccount, dispatch),
    setSelectedUser: (user) => setSelectedUserAction(user, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentList)