import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { listStyles } from '../../styles'
import EventListenerService from "../../utils/eventListenerService"
import { gradeStudentsAction } from '../../actions/coursesActions'
import LoadingSpinner from '../../components/LoadingSpinner'
import { generalStyles } from '../../styles'
import Pagination from '../../components/Pagination'
import GradeStudentRow from '../../components/RowComponents/GradeStudentRow'

function GradeStudentsList(props) {

    const [isWorking, setIsWorking] = useState(false);
    const [query, setQuery] = useState('');
    const [studentsToGrade, setStudentsToGrade] = useState([]);
    const [searchedStudents, setSearchedStudents] = useState([]);
    const [studentGrades, setStudentGrades] = useState([]);
    const [gradeEnabled, setGradeEnabled] = useState(false);

    useEffect(() => {
        let temp = props.studentsToGrade
        setStudentsToGrade(temp)
        setSearchedStudents(search(temp, query))
    }, [props.studentsToGrade]);

    const onQueryChange = ({target}) => {
        let newStudentsToEnroll = search(studentsToGrade, target.value)

        setQuery(target.value)
        setSearchedStudents(newStudentsToEnroll)
    }

    const keys = ["firstName", "lastName", "id"]
    const search = (data, query) => {
        if (query !== '') {
            let filteredData = data
            let multiQuery = query.split(' ')
            multiQuery.forEach(mq => { if (mq === '') return
                filteredData = filteredData.filter(item => keys.some(key => item[key].toLowerCase().includes(mq.toLowerCase())))
            })

            return filteredData
        }
    
        return data
    }

    const gradeChanged = (e) => {
        let newGrades = studentGrades

        debugger
        if (e.target.value == 0) {
            delete newGrades[e.target.id]
        } else {
            newGrades[e.target.id] = e.target.value
        }

        setGradeEnabled(Object.keys(newGrades).length !== 0)
        setStudentGrades(newGrades)
    }

    const gradeStudents = async() => {
        if (Object.keys(studentGrades).length !== 0) {
            setIsWorking(true)
            let grades = []
            Object.entries(studentGrades).forEach(([studentAddress, courseGrade]) => {
                grades.push({studentAddress, courseGrade})
            })
            await props.gradeStudents(props.courseId, grades, props.selectedAccount, props.eventId)
            setIsWorking(false)
            setStudentGrades({})
        } else {
            EventListenerService.notify("error", 'fields not populated!')
        }
    }
    
    const { course } = props
    return (
        <div style={{ padding: '1rem' }}>
            <h4>{course.name}</h4>
            <input type="text"
                id="query"
                placeholder='Search...'
                className="search"
                onChange={onQueryChange}/>
                
            <Container>
                <Row style={listStyles.borderBottom}>
                    <Col>Student name</Col>
                    <Col>Student address</Col>
                    <Col xs={'auto'}>Grade</Col>
                </Row>
                <Pagination 
                    data={searchedStudents}
                    RenderComponent={GradeStudentRow}
                    func={gradeChanged}
                    pageLimit={5}
                    dataLimit={5}
                />
            </Container>
            {
                isWorking ?
                <Button variant="primary" type="submit" style={generalStyles.button} disabled><LoadingSpinner/></Button> :
                <Button className="btn btn-primary" onClick={gradeStudents} disabled={!gradeEnabled}>Grade students</Button>
            }

        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    const allStudents = (state.users.students || [])
    const studentGrades = (state.courses.gradesByStudentByCourse[ownProps.course.id] || [])
    const studentsToGrade = allStudents.filter(stud => studentGrades.filter(sg => sg.grade > 5).some(fs => fs.studentId === stud.id))
    return {
        selectedAccount: state.eth.selectedAccount,
        studentsToGrade,
        courseId: ownProps.course.id,
        eventId: state.event.selectedEvent.id
    }
}

const mapDispatchToProps = dispatch => ({
    gradeStudents: (courseId, studentGrades, selectedAccount, eventId) => gradeStudentsAction(courseId, studentGrades, selectedAccount, eventId, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(GradeStudentsList)