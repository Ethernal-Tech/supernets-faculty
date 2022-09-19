import React, {useEffect} from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { loadStudentCoursesAction } from '../../actions/coursesActions'
import { loadStudentCertificateAction } from '../../actions/certificateActions'
import { listStyles } from '../../styles'
import { formatDate } from '../../utils/utils'
//import { emptyArray, emptyObject } from 'utils/commonHelper'

function StudentCertificate(props) {
    const now = new Date()
    this.dateNow = formatDate(now)

    useEffect(() => {
        if (!props.certificateData) {
            loadData()
        }      
    }, [])

    const loadData = async () => {
        await props.loadStudentCertificate(props.studentId, props.selectedEvent.id)
    }

    return (
        <div style={{ padding: '20px' }}>
            <h4>Official certificated made in blockchain</h4>
            <p>Token id: {props.certificateData.tokenId} Uri: Token uri: {props.certificateData.tokenURI}</p>
            {/* <div style={{position: 'fixed', bottom: '10px', left: '20px', zIndex: '20'}}>
                <img src={`${process.env.PUBLIC_URL}/logoplan.png`} height={45} alt="logoplan" />
            </div>
            <Container>
                <Row style={listStyles.paddingTop10}>Issued to: {student.name}</Row>
                <Row>Issued by: Faculty of Blockchain</Row>
                <Row>Event type: PlanB Summer School</Row>
                <Row>Location: Lugano</Row>
                <Row>Date: {this.dateNow}</Row>

                <Row style={{ ...listStyles.borderBottom, ...listStyles.paddingTop10 }}>
                    <Col>Course Name</Col>
                    <Col>Professor's Name</Col>
                    <Col>Grade</Col>
                </Row>
                {
                    studentCourses.map((course, ind) => (
                        <Row
                            key={`course_${ind}`}
                            style={ind === studentCourses.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                            <Col>{course.name}</Col>
                            <Col>{course.professorName}</Col>
                            <Col>{course.grade}</Col>
                        </Row>
                    ))
                }
            </Container> */}
        </div>
    )
}


const mapStateToProps = (state, ownProps) => {
    // const allCourses = state.courses.allCourses || emptyArray
    // const gradesByCourse = (state.courses.gradesByCourseByStudent || emptyObject)[ownProps.student.id] || emptyObject
    // const studentCourses = ((state.courses.studentCourses || emptyObject)[ownProps.student.id] || emptyArray).map(x => {
    //     const course = allCourses.find(y => y.id === x)
    //     const grade = gradesByCourse[x]
    //     return {
    //         ...course,
    //         grade
    //     }
    // }).filter(x => parseInt(x.grade) > 5)

    const studentId = ownProps.student.id
    const certificateData = state.certificates.studentCertificates[studentId] || undefined

    return {
        certificateData,
        studentId,
        selectedEvent: state.event.selectedEvent,
    }
}

const mapDispatchToProps = dispatch => ({
    loadStudentCourses: (accountAddress, eventId) => loadStudentCoursesAction(accountAddress, eventId, dispatch),
    loadStudentCertificate: (studentId, eventId) => loadStudentCertificateAction(studentId, eventId, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentCertificate)
