import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { getUserRole } from 'utils/userUtils'
import { USER_ROLES } from 'utils/constants'
import { loadStudentCoursesAction } from 'actions/coursesActions'
import { loadStudentCertificateAction } from 'actions/certificateActions'
import { emptyArray } from 'utils/commonHelper'

function StudentCertificate(props) {
    const now = new Date()
    //const dateNow = formatDate(now)
    const [metadata, setMetadata] = useState({})

    useEffect(() => {
        if (!props.certificateData) {
            loadData()
        } else {
            loadMetadata(props.certificateData.tokenURI)
        }
    }, [props.certificateData])

    const loadData = async () => {
        await props.loadStudentCertificate(props.student.id, props.selectedEvent.id)
    }

    const loadMetadata = async (uri) => {
        const response = await fetch(uri)
        const metadata = await response.json()
        setMetadata(metadata)
    }

    if (!props.student) {
        return null;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h4>Official certificated made in blockchain</h4>
            <p>Token id: {props.certificateData ? props.certificateData.tokenId : 'tokenId'} Uri: {props.certificateData ? props.certificateData.tokenURI : 'uri'}</p>
            { metadata &&  <p>Metadata name: { metadata.name }</p> }
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
    const userRole = getUserRole(state)
    const students = state.users.students || emptyArray

    let student
    let certificateData
    if (ownProps.stud) {
        student = students.find(stud => stud.id === ownProps.stud)
        certificateData = state.certificates.studentCertificates[ownProps.stud] || undefined
    }
    else if (userRole === USER_ROLES.STUDENT) {
        student = students.find(x => x.id === state.eth.selectedAccount)
        certificateData = state.certificates.studentCertificates[state.eth.selectedAccount] || undefined
    }

    return {
        certificateData,
        student,
        selectedEvent: state.event.selectedEvent,
    }
}

const mapDispatchToProps = dispatch => ({
    loadStudentCourses: (accountAddress, eventId) => loadStudentCoursesAction(accountAddress, eventId, dispatch),
    loadStudentCertificate: (studentId, eventId) => loadStudentCertificateAction(studentId, eventId, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentCertificate)
