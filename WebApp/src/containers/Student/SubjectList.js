import React from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { loadStudentSubjectsAction } from '../../actions/subjectActions'

class SubjectList extends React.Component {

    componentDidMount() {
        this.loadSubjects()
    }

    loadSubjects = async () => {
        await this.props.loadStudentSubjects(this.props.student.id)
    }

    render() {
        const { student, studentSubjects } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>{student.name}</h4>

                <Container>
                    <Row style={styles.borderBottom}>
                        <Col>Subject Name</Col>
                        <Col>Professor's Name</Col>
                        <Col>Grade</Col>
                    </Row>
                    {
                        studentSubjects.map((subject, ind) => (
                            <Row
                                key={`subj_${ind}`}
                                style={ind === studentSubjects.length - 1 ? styles.paddingVertical : { ...styles.paddingVertical, ...styles.borderBottomThin }}>
                                <Col>{subject.name}</Col>
                                <Col>{subject.professorName}</Col>
                                <Col>{subject.grade}</Col>
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
    const studentSubjects = ((state.subjects.studentSubjects || {})[ownProps.student.id] || []).map(x => {
        const subject = allSubjects.find(y => y.id === x)
        const grade = gradesBySubject[x]
        return {
            ...subject,
            grade
        }
    })
    return {
        studentSubjects,
    }
}

const mapDispatchToProps = dispatch => ({
    loadStudentSubjects: (accountAddress) => loadStudentSubjectsAction(accountAddress, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SubjectList)

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