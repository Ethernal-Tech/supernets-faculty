import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button } from 'components/Button'
import { listStyles } from '../styles'
import { contractToGrade }  from '../utils/userUtils'
import Pagination from '../components/Pagination'
import CourseStudentRow from './RowComponents/CourseStudentRow'
import { disenrollStudentsToCourseAction } from '../actions/coursesActions'
import EventListenerService from "../utils/eventListenerService"
import { ContentShell } from 'features/Content';
import { emptyArray, emptyObject } from 'utils/commonHelper'

export const CourseStudents = ({ courseId, userRole, selectedAccount }) => {
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
    const allStudents = state.users.students || emptyArray
    const courses = state.courses.allCourses || emptyArray
    const course = courses.find(x => x.id === courseId)
    const courseStudents = allStudents.filter(stud => course.students.some(y => y === stud.id))
    const gradesByStudent = (state.courses.gradesByStudentByCourse || emptyObject)[courseId] || emptyObject
	const eventId = state.event.selectedEvent.id

    const [isWorking, setIsWorking] = useState(false);
    const [query, setQuery] = useState('');
    const [allChecked, setAllChecked] = useState(false);
    const [studentsToDisenroll, setStudentsToDisenroll] = useState<any[]>([]);
    const [searchedStudents, setSearchedStudents] = useState<any[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

    useEffect(
		() => {
	        let tempList = courseStudents.slice().map(stud => ({...stud, selected: false}))
	        setStudentsToDisenroll(tempList)
	        setSearchedStudents(search(tempList, query))
		},
		[courseStudents]
	)

    const getStudentGrade = (studentId) => {
        return contractToGrade.get((gradesByStudent.find(x => x.studentId === studentId) || {}).grade)
    }

    const onCheckAll = (e) => {
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
			await disenrollStudentsToCourseAction(course.id, studentAddrs, selectedAccount, eventId, dispatch)
            setIsWorking(false)
            setAllChecked(false)
            setSelectedStudents([])
        }
        else {
            EventListenerService.notify("error", 'fields not populated!')
        }
    }

    return (
        <ContentShell title={course.title}>
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
					isAdmin={undefined}
                />
            </Container>
			<Button
				text={`Disenroll ${selectedStudents.length} students`}
				onClick={disenrollStudents}
				disabled={selectedStudents.length === 0}
				isLoading={isWorking}
			/>
        </ContentShell>
    )
}
