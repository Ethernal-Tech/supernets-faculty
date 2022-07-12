import React from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { USER_ROLES } from '../../utils/constants'
import AddUserComponent from '../../components/AddUserComponent'
import { addStudentAction } from '../../actions/userActions'

class StudentList extends React.Component {
    onSubmit = async (name, addr) => this.props.addStudent(name, addr, this.props.selectedAccount)

    render() {
        const { students, userRole } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>Students</h4>
                
                <Container>
                    <Row style={styles.borderBottom}>
                        <Col>Name</Col>
                        <Col>Address</Col>
                    </Row>
                    {
                        students.map((student, ind) => (
                            <Row
                                key={`stud_${ind}`}
                                style={ind === students.length - 1 ? styles.paddingVertical : { ...styles.paddingVertical, ...styles.borderBottomThin }}>
                                <Col>{student.name} </Col>
                                <Col>{student.id}</Col>
                            </Row>
                        ))
                    }
                </Container>
                {
                    userRole === USER_ROLES.ADMIN &&
                    <AddUserComponent onSubmit={this.onSubmit} />
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    students: state.users.students || [],
    selectedAccount: state.eth.selectedAccount,
})

const mapDispatchToProps = dispatch => ({
    addStudent: (name, addr, selectedAccount) => addStudentAction(name, addr, selectedAccount, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentList)

const styles = {
    borderBottomThin: {
        borderBottom: '1px solid black'
    },
    borderBottom: {
        borderBottom: '2px solid black'
    },
    paddingVertical: {
        paddingTop: 5,
        paddingBottom: 5,
    }
}