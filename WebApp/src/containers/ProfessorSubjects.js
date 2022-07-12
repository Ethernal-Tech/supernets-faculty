import React from 'react'
import '../listStyles.css'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { addSubjectAction, loadProfessorSubjectsAction } from '../actions/subjectActions'
import { listStyles } from '../styles'
import { USER_ROLES } from '../utils/constants'
import AddSubjectComponent from '../components/AddSubjectComponent'

class ProfessorSubjects extends React.Component {
    componentDidMount() {
        const { professor, loadProfessorSubjects } = this.props
        loadProfessorSubjects(professor.id)
    }

    onSubmit = async subjectName => this.props.addSubject(subjectName, this.props.professor.id, this.props.selectedAccount)

    render() {
        const { professor, subjects, userRole } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>{professor.name}</h4>
                
                <Container>
                    <Row style={listStyles.borderBottom}>
                        <Col>Subject name</Col>
                        <Col>Number of students</Col>
                    </Row>

                    {
                        subjects.map((subject, ind) => (
                            <Row key={`sub_${subject.id}`} style={ind === subjects.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                                <Col><Link to={`/subject?subjId=${subject.id}`}>{subject.name}</Link></Col>
                                <Col>{subject.students.length}</Col>
                            </Row>
                        ))
                    }
                </Container>
                {
                    userRole === USER_ROLES.ADMIN &&
                    <AddSubjectComponent onSubmit={this.onSubmit} />
                }
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const professorAddr = ownProps.professor?.id
    const allSubjects = state.subjects.allSubjects || []
    const professorSubjectIds = (professorAddr ? state.subjects.subjectsByProfessorAddr[professorAddr] : undefined) || []
    const subjects = allSubjects.filter(x => professorSubjectIds.some(y => y === x.id))
    return {
        subjects,
    }
}

const mapDispatchToProps = dispatch => ({
    loadProfessorSubjects: professorAddr => loadProfessorSubjectsAction(professorAddr, dispatch),
    addSubject: (subjectName, professorAddr, selectedAccount) => addSubjectAction(subjectName, professorAddr, selectedAccount, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorSubjects)