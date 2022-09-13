import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { listStyles } from '../../styles'
import EventListenerService from "utils/eventListenerService"
import { enrollStudentsToCourseAction } from 'actions/coursesActions'
import Pagination from 'components/Pagination'
import EnrollStudentRow from '../RowComponents/EnrollStudentRow'
import { ContentShell } from 'features/Content';
import { emptyArray, noop } from 'utils/commonHelper'
import { Button } from 'components/Button';

const keys = ["firstName", "lastName", "id"]

export const EnrollStudentsList = ({ courseId, selectedAccount }) => {
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const allStudents = state.users.students || emptyArray
    const courses = state.courses.allCourses || emptyArray
    const course = courses.find(x => x.id === courseId)
    const studentsToEnrollProps = allStudents.filter(stud => !course.students.some(y => y === stud.id))
	const eventId = state.event.selectedEvent.id

    const [isWorking, setIsWorking] = useState(false);
    const [query, setQuery] = useState('');
    const [allChecked, setAllChecked] = useState(false);
    const [studentsToEnroll, setStudentsToEnroll] = useState<any[]>([]);
    const [searchedStudents, setSearchedStudents] = useState<any[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

    useEffect(() => {
        let tempList = studentsToEnrollProps.slice().map(stud => ({...stud, selected: false}))
        setStudentsToEnroll(tempList)
        setSearchedStudents(search(tempList, query))
    }, [studentsToEnrollProps]);

    const onCheckAll= (e) => {
        let tempSearchedList = searchedStudents;
        tempSearchedList.map(user => (user.selected = e.target.checked));

        let tempList = studentsToEnroll;
        tempSearchedList.forEach(searchedStud => {
            tempList.find(stud => stud.id === searchedStud.id).selected = e.target.checked;
        })

        setAllChecked(e.target.checked)
        setStudentsToEnroll(tempList)
        setSearchedStudents(tempSearchedList)
        setSelectedStudents(studentsToEnroll.filter((e) => e.selected))

    }

    const onItemCheck = (e, item) => {
        let tempList = studentsToEnroll;
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
        setStudentsToEnroll(tempList)
        setSelectedStudents(studentsToEnroll.filter((e) => e.selected))
    }

    const onQueryChange = ({target}) => {
        let newSearchStudents = search(studentsToEnroll, target.value)
        const totalItems = newSearchStudents.length;
        const totalCheckedItems = newSearchStudents.filter((e) => e.selected).length;

        setAllChecked(totalItems === totalCheckedItems)
        setQuery(target.value)
        setSearchedStudents(newSearchStudents)
    }

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

    const enrollStudents = async() => {
        if (selectedStudents.length !== 0){
            setIsWorking(true)
			const studentAddrs = selectedStudents.map(stud => stud.id)
			await enrollStudentsToCourseAction(course.id, studentAddrs, selectedAccount, eventId, dispatch)
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
                        />
                    </Col>
                    <Col>Student name</Col>
                    <Col>Student address</Col>
                </Row>
                <Pagination
                    data={searchedStudents}
                    RenderComponent={EnrollStudentRow}
                    func={onItemCheck}
                    pageLimit={5}
					dataLimit={5}
					func1={noop}
					isAdmin={undefined}
                />
            </Container>
			<Button
				text={`Enroll ${selectedStudents.length} students`}
				onClick={enrollStudents}
				disabled={selectedStudents.length === 0}
				isLoading={isWorking}
			/>
        </ContentShell>
    )
}
