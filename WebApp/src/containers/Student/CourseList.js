import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import { loadStudentCoursesAction, generateCertificateAction } from '../../actions/coursesActions'
import { listStyles } from '../../styles'
import { contractToGrade, gradeToContract }  from '../../utils/userUtils'
import { createMetadata, uploadMetadata } from '../../utils/nftUtils'
import { address } from '../../faculty'
import Pagination from '../../components/Pagination'
import StudentCourseRow from '../../components/RowComponents/StudentCourseRow'

function CourseList(props) {

    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [searchedCourses, setSearchedCourses] = useState([]);

    useEffect(() => {
        if (courses.length == 0) {
            props.loadStudentCourses(props.student.id, props.selectedEvent.eventId)
    
            let temp = props.studentCourses
            setCourses(temp)
            setSearchedCourses(search(temp, query))
        }
    }, [props.studentCourses]);

    const getCourseGrade = (courseId) => {
        const grade = courses.find(x => x.id === courseId).grade.grade
        return contractToGrade.get(grade)
    }

    const onQueryChange = ({target}) => {
        let newCourses = search(courses, target.value)

        setQuery(target.value)
        setSearchedCourses(newCourses)
    }

    const keys = ["title"] // course.title
    const search = (data, query) => {
        return data.filter(item => keys.some(key => item[key].toLowerCase().includes(query.toLowerCase())))
    }

    const onGenerateCertificate = async evt => {
        const metadata = createMetadata(props.student, props.studentCourses)
        console.log(metadata)
        const ipfsUri = await uploadMetadata(metadata);         

        console.log(ipfsUri)
        await props.generateCertificate(props.student.id, props.selectedAccount, ipfsUri, props.selectedEvent.eventId)
    }

    const { student, studentCourses } = props
    const certificateId = 1 // get from props
    return (
        <div style={{ padding: '1rem' }}>
            <h4>{student.name}</h4>
            <input type="text"
                id="query"
                placeholder='Search...'
                className="search"
                onChange={onQueryChange}/>

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
                                    <Button variant="primary" type="button" onClick={onGenerateCertificate}>Produce certificate</Button>
                            }
                        </Col>
                    </Row> 
                }
                <Row style={listStyles.borderBottom}>
                    <Col>Course Name</Col>
                    <Col>Professor's Name</Col>
                    <Col xs={'auto'}>Grade</Col>
                </Row>
                <Pagination 
                    data={searchedCourses}
                    RenderComponent={StudentCourseRow}
                    func={getCourseGrade}
                    pageLimit={5}
                    dataLimit={5}
                />
            </Container>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    const allCourses = state.courses.allCourses || []
    const gradesByCourse = (state.courses.gradesByCourseByStudent || {})[ownProps.student.id] || {}
    const studentCourses = ((state.courses.studentCourses || {})[ownProps.student.id] || []).map(x => {
        const course = allCourses.find(y => y.id === x)
        const grade = gradesByCourse.find(y => y.courseId === x)
        return {
            ...course,
            grade
        }
    })
    return {
        selectedAccount: state.eth.selectedAccount,
        selectedEvent: state.event.selectedEvent,
        studentCourses: studentCourses,
    }
}

const mapDispatchToProps = dispatch => ({
    loadStudentCourses: (accountAddress, eventId) => loadStudentCoursesAction(accountAddress, eventId, dispatch),
    generateCertificate: (studentAddr, selectedAccount, ipfsURI, eventId) => generateCertificateAction(studentAddr, selectedAccount, ipfsURI, eventId)
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseList)