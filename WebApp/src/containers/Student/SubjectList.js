import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import { loadProfessorSubjectsAction, loadStudentSubjectsAction } from '../../actions/subjectActions'
import { listStyles } from '../../styles'
import { USER_ROLES } from '../../utils/constants'

class SubjectList extends React.Component {
    componentDidMount() {
        this.load()
    }

    load = async () => {
        const { userRole, student, loadStudentSubjects, loadProfessorSubjects, selectedAccount } = this.props
        if (userRole === USER_ROLES.PROFESSOR) {
            await loadProfessorSubjects(selectedAccount)
        }

        await loadStudentSubjects(student.id)
    }

    render() {
        const { student, studentSubjects, userRole, studParam } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>{student.name}</h4>

                <Container>
                    {
                        userRole === USER_ROLES.ADMIN &&
                        <Row style={{ padding: '1rem 0' }}>
                            <Col>
                                <Link to={`/certificate${studParam ? ('?stud=' + studParam) : ''}`} target="_blank">
                                    <Button variant="primary" type="button">
                                        Produce certificate
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    }
                    <Row style={listStyles.borderBottom}>
                        <Col>Subject Name</Col>
                        <Col>Professor's Name</Col>
                        <Col>Grade</Col>
                    </Row>
                    {
                        studentSubjects.map((subject, ind) => (
                            <Row
                                key={`subj_${ind}`}
                                style={ind === studentSubjects.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                                <Col>{subject.name}</Col>
                                <Col>{subject.professorName}</Col>
                                <Col>{subject.grade !== undefined ? subject.grade : '*'}</Col>
                            </Row>
                        ))
                    }
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const allSubjects = state.subjects.allSubjects || []
    const gradesBySubject = (state.subjects.gradesBySubjectByStudent || {})[ownProps.student.id] || {}
    let studentSubjects = ((state.subjects.studentSubjects || {})[ownProps.student.id] || []).map(x => {
        const subject = allSubjects.find(y => y.id === x)
        const grade = gradesBySubject[x]
        return {
            ...subject,
            grade
        }
    })

    const selectedAccount = state.eth.selectedAccount
    if (ownProps.userRole === USER_ROLES.STUDENT) {
        if (selectedAccount !== ownProps.student.id) {
            studentSubjects = studentSubjects.map(x => ({ ...x, grade: undefined }))
        }
    }
    else if (ownProps.userRole === USER_ROLES.PROFESSOR) {
        const professorSubjectsSet = new Set((state.subjects.subjectsByProfessorAddr || {})[selectedAccount] || [])
        studentSubjects = studentSubjects.map(x => ({ ...x, grade: professorSubjectsSet.has(x.id) ? x.grade : undefined }))
    }

    return {
        selectedAccount,
        studentSubjects,
    }
}

const mapDispatchToProps = dispatch => ({
    loadStudentSubjects: accountAddress => loadStudentSubjectsAction(accountAddress, dispatch),
    loadProfessorSubjects: professorAddr => loadProfessorSubjectsAction(professorAddr, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(SubjectList)