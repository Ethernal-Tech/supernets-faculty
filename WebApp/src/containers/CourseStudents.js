import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { listStyles } from '../styles'
import { generalStyles } from '../styles'
import { contractToGrade }  from '../utils/userUtils'
import Pagination from '../components/Pagination'
import CourseStudentRow from '../components/RowComponents/CourseStudentRow'
import { disenrollStudentsToCourseAction } from '../actions/coursesActions'
import EventListenerService from "../utils/eventListenerService"

function CourseStudents(props) {

    const [isWorking, setIsWorking] = useState(false);
    const [query, setQuery] = useState('');
    const [allChecked, setAllChecked] = useState(false);
    const [studentsToDisenroll, setStudentsToDisenroll] = useState([]);
    const [searchedStudents, setSearchedStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        let tempList = props.courseStudents.slice().map(stud => ({...stud, selected: false}))
        setStudentsToDisenroll(tempList)
        setSearchedStudents(search(tempList, query))
    }, [props.courseStudents])

    const getStudentGrade = (studentId) => {
        return contractToGrade.get((props.gradesByStudent.find(x => x.studentId === studentId) || {}).grade)
    }

    const onCheckAll= (e) => {
        let tempSearchedList = searchedStudents;
        tempSearchedList.map(user => (user.selected = e.target.checked));

        let tempList = studentsToDisenroll;
        tempSearchedList.forEach(searchedStud => {
            tempList.find(stud => stud.id === searchedStud.id).selected = e.target.checked;
        })

        setAllChecked(e.target.checked)
        setStudentsToDisenroll(tempList)
        setSearchedStudents(tempSearchedList)
        setSelectedStudents(studentsToDisenroll.filter((e) => e.selected))
    }
    
    const onItemCheck = (e, item) => {
        let tempList = studentsToDisenroll;
        tempList.map((stud) => {
            if (stud.id === item.id) {
                stud.selected = e.target.checked;
            }
            return stud;
        });

        //To Control Master Checkbox State
        const totalItems = searchedStudents.length;
        const totalCheckedItems = searchedStudents.filter((e) => e.selected).length;

        // Update State
        setAllChecked(totalItems === totalCheckedItems)
        setStudentsToDisenroll(tempList)
        setSelectedStudents(studentsToDisenroll.filter((e) => e.selected))
    }

    const onQueryChange = ({target}) => {
        let newSearchStudents = search(studentsToDisenroll, target.value)
        const totalItems = newSearchStudents.length;
        const totalCheckedItems = newSearchStudents.filter((e) => e.selected).length;

        setAllChecked(totalItems === totalCheckedItems)
        setQuery(target.value)
        setSearchedStudents(newSearchStudents)
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

    const disenrollStudents = async() => {
        if (selectedStudents.length !== 0){
            setIsWorking(true)
            const studentAddrs = selectedStudents.map(stud => stud.id)
            await props.disenrollStudentsToCourse(props.course.id, studentAddrs, props.selectedAccount, props.eventId)
            setIsWorking(false)
            setAllChecked(false)
            setSelectedStudents([])
        }
        else {
            EventListenerService.notify("error", 'fields not populated!')
        }
    }

    const { course } = props
    return (
        <div style={{ padding: '1rem' }}>
            <h4>{course.title}</h4>
            <input type="text"
                id="query"
                placeholder='Search...'
                className="search"
                onChange={onQueryChange}/>

            <Container>
                <Row style={listStyles.borderBottom}>
                    <Col xs={'auto'}>
                        <input
                            type="checkbox" className="form-check-input"
                            checked={allChecked}
                            id="checkAll"
                            onChange={(e) => onCheckAll(e)}
                            disabled={searchedStudents.some(student => getStudentGrade(student.id) !== "---")}
                        />
                    </Col>
                    <Col>Student name</Col>
                    <Col>Student address</Col>
                    <Col>Grade</Col>
                </Row>
                <Pagination 
                    data={searchedStudents}
                    RenderComponent={CourseStudentRow}
                    func={getStudentGrade}
                    func1={onItemCheck}
                    pageLimit={5}
                    dataLimit={5}
                />
            </Container>
            {
                isWorking ?
                <Button variant="primary" type="submit" style={generalStyles.button} disabled><LoadingSpinner/></Button> :
                <Button className="btn btn-primary" onClick={disenrollStudents} disabled={selectedStudents.length === 0}>Disenroll {selectedStudents.length} students</Button>
            }
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    const allStudents = (state.users.students || [])
    const courses = state.courses.allCourses || []
    const course = courses.find(x => x.id === ownProps.courseId)
    const courseStudents = allStudents.filter(stud => course.students.some(y => y === stud.id))
    const gradesByStudent = (state.courses.gradesByStudentByCourse || {})[ownProps.courseId] || {}

    return {
        courseStudents,
        gradesByStudent,
        course,
        eventId: state.event.selectedEvent.id
    }
}

const mapDispatchToProps = dispatch => ({
    disenrollStudentsToCourse: (courseId, studentAddrs, selectedAccount, eventId) => disenrollStudentsToCourseAction(courseId, studentAddrs, selectedAccount, eventId, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseStudents)