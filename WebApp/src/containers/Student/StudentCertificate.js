import React from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { loadStudentSubjectsAction } from '../../actions/subjectActions'
import { listStyles } from '../../styles'
import { formatDate } from '../../utils/utils'

class StudentCertificate extends React.Component {
    constructor(props) {
        super(props)
        const now = new Date()
        this.dateNow = formatDate(now)
    }

    componentDidMount() {
        this.props.loadStudentSubjects(this.props.student.id)
    }

    render() {
        const { student, studentSubjects } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>Official certificated made in blockchain</h4>
                <div style={{position: 'fixed', bottom: '20px', left: '20px', zIndex: '20'}}>
                    <img src={`${process.env.PUBLIC_URL}/logoplan.png`}  alt="logoplan" />
                </div>
                <Container>
                    <Row style={listStyles.paddingTop10}>Issued to: {student.name}</Row>
                    <Row>Issued by: Faculty of Blockchain</Row>
                    <Row>Event type: PlanB Summer School</Row>
                    <Row>Location: Lugano</Row>
                    <Row>Date: {this.dateNow}</Row>

                    <Row style={{ ...listStyles.borderBottom, ...listStyles.paddingTop10 }}>
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
    }).filter(x => parseInt(x.grade) > 5)
    return {
        studentSubjects,
    }
}

const mapDispatchToProps = dispatch => ({
    loadStudentSubjects: (accountAddress) => loadStudentSubjectsAction(accountAddress, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentCertificate)