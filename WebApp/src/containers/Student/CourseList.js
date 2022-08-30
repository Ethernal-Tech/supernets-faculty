import React from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import { loadProfessorCoursesAction, loadStudentCoursesAction, generateCertificateAction } from '../../actions/coursesActions'
import { listStyles } from '../../styles'
import { USER_ROLES } from '../../utils/constants'
import { contractToGrade }  from '../../utils/userUtils'
import { createMetadata, uploadMetadata } from '../../utils/nftUtils'
import { address } from '../../faculty'

class CourseList extends React.Component {
    componentDidMount() {
        this.load()
    }

    load = async () => {
        const { userRole, student, loadStudentCourses, loadProfessorCourses, selectedAccount } = this.props
        if (userRole === USER_ROLES.PROFESSOR) {
            await loadProfessorCourses(selectedAccount)
        }

        await loadStudentCourses(student.id, this.props.selectedEvent.eventId)
    }

    onGenerateCertificate = async evt => {
        const metadata = createMetadata(this.props.student, this.props.studentCourses)
        console.log(metadata)
        const ipfsUri = await uploadMetadata(metadata);         

        console.log(ipfsUri)
        await this.props.generateCertificate(this.props.student.id, this.props.selectedAccount, ipfsUri, this.props.selectedEvent.eventId)
    }

    render() {
        const { student, studentCourses, userRole } = this.props
        const certificateId = 1 // get from props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>{student.name}</h4>

                <Container>
                    { 
                        <Row style={{ padding: '1rem 0' }}>
                            <Col>
                                {
                                    // certificateId > 0 
                                    // ? userRole === USER_ROLES.ADMIN &&
                                    //     <a href={`https://testnets.opensea.io/assets/rinkeby/${address}/${certificateId}`}>
                                    //         <Button variant="primary" type="button">Certificate</Button>
                                    //     </a>
                                     <Button variant="primary" type="button" onClick={this.onGenerateCertificate}>Produce certificate</Button>
                                }
                            </Col>
                        </Row> 
                    }
                    <Row style={listStyles.borderBottom}>
                        <Col>Course Name</Col>
                        <Col>Professor's Name</Col>
                        <Col>Grade</Col>
                    </Row>
                    {
                        studentCourses.map((course, ind) => (
                            <Row
                                key={`course_${ind}`}
                                style={ind === studentCourses.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                                <Col>{course.title}</Col>
                                <Col>{course.professorName}</Col>
                                <Col>{contractToGrade.get(course.grade.grade)}</Col>
                            </Row>
                        ))
                    }
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const allCourses = state.courses.allCourses || []
    const gradesByCourse = (state.courses.gradesByCourseByStudent || {})[ownProps.student.id] || {}
    let studentCourses = ((state.courses.studentCourses || {})[ownProps.student.id] || []).map(x => {
        const course = allCourses.find(y => y.id === x)
        const grade = gradesByCourse.find(y => y.courseId === x)
        return {
            ...course,
            grade
        }
    })

    const selectedAccount = state.eth.selectedAccount
    if (ownProps.userRole === USER_ROLES.STUDENT) {
        if (selectedAccount !== ownProps.student.id) {
            studentCourses = studentCourses.map(x => ({ ...x, grade: undefined }))
        }
    }
    else if (ownProps.userRole === USER_ROLES.PROFESSOR) {
        const professorCoursesSet = new Set((state.courses.coursesByProfessorAddr || {})[selectedAccount] || [])
        studentCourses = studentCourses.map(x => ({ ...x, grade: professorCoursesSet.has(x.id) ? x.grade : undefined }))
    }
    
    return {
        selectedAccount,
        studentCourses: studentCourses,
        selectedEvent: state.event.selectedEvent,
    }
}

const mapDispatchToProps = dispatch => ({
    loadStudentCourses: (accountAddress, eventId) => loadStudentCoursesAction(accountAddress, eventId, dispatch),
    loadProfessorCourses: professorAddr => loadProfessorCoursesAction(professorAddr, dispatch),
    generateCertificate: (studentAddr, selectedAccount, ipfsURI, eventId) => generateCertificateAction(studentAddr, selectedAccount, ipfsURI, eventId)
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseList)