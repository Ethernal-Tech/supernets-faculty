import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { listStyles } from '../styles'
import EnrollStudentToSubjectComponent from '../components/EnrollStudentToSubjectComponent'
import { USER_ROLES } from '../utils/constants'
import { enrollStudentToSubjectAction } from '../actions/subjectActions'

class SubjectStudents extends React.Component {

    onEnroll = async studentAddr => this.props.enrollStudentToSubject(this.props.subject.id, studentAddr, this.props.selectedAccount)

    render() {
        const { userRole, subject, subjectStudents, studentIdToInd, studentsToEnroll } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>{subject.name}</h4>
                
                <Container>
                    <Row style={listStyles.borderBottom}>
                        <Col>Student</Col>
                        <Col>Student address</Col>
                        {/* <Col xs={'auto'}>Grade</Col> */}
                    </Row>

                    {
                        subjectStudents.map((student, ind) => (
                            <Link key={`stud_${ind}`} to={`/student?stud=${studentIdToInd[student.id]}`}>
                                <Row style={ind === subjectStudents.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                                    <Col>{student.name}</Col>
                                    <Col>{student.id}</Col>
                                    {/* <Col xs={'auto'}>asd</Col> */}
                                </Row>
                            </Link>
                        ))
                    }
                </Container>
                {
                    userRole === USER_ROLES.ADMIN &&
                    <EnrollStudentToSubjectComponent onSubmit={this.onEnroll} studentsToEnroll={studentsToEnroll}/>
                }
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const allStudents = (state.users.students || [])
    const subjectStudents = ownProps.subject.students.map(x => allStudents.find(y => y.id === x))
    const studentsToEnroll = allStudents.filter(x => !ownProps.subject.students.some(y => y === x.id))
    return {
        subjectStudents,
        studentsToEnroll,
        studentIdToInd: allStudents.reduce((acc, cv, ind) => {
            acc[cv.id] = ind
            return acc
        }, {}),
    }
}

const mapDispatchToProps = dispatch => ({
    enrollStudentToSubject: (subjectId, studentAddr, selectedAccount) => enrollStudentToSubjectAction(subjectId, studentAddr, selectedAccount, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(SubjectStudents)