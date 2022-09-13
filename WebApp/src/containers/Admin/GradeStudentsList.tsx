import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { listStyles } from '../../styles'
import EventListenerService from "../../utils/eventListenerService"
import { gradeStudentsAction } from '../../actions/coursesActions'
import Pagination from '../../components/Pagination'
import GradeStudentRow from '../RowComponents/GradeStudentRow'
import { ContentShell } from 'features/Content';
import { noop } from 'utils/commonHelper';
import { Button } from 'components/Button';

export const GradeStudentsList = ({ course, selectedAccount }) => {
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const allStudents = (state.users.students || [])
    const studentGradesProps = (state.courses.gradesByStudentByCourse[course.id] || [])
    const studentsToGradeProps = allStudents.filter(stud => studentGradesProps.filter(sg => sg.grade > 5).some(fs => fs.studentId === stud.id))
    const eventId = state.event.selectedEvent.id
	const courseId = course.id

    const [isWorking, setIsWorking] = useState(false);
    const [query, setQuery] = useState('');
    const [studentsToGrade, setStudentsToGrade] = useState([]);
    const [searchedStudents, setSearchedStudents] = useState([]);
    const [studentGrades, setStudentGrades] = useState([]);
    const [gradeEnabled, setGradeEnabled] = useState(false);

    useEffect(
		() => {
	        let temp = studentsToGradeProps
	        setStudentsToGrade(temp)
	        setSearchedStudents(search(temp, query))
		},
		[studentsToGradeProps]
	);

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
        let newGrades: any = studentGrades

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
            let grades: any[] = []
            Object.entries(studentGrades).forEach(([studentAddress, courseGrade]) => {
                grades.push({studentAddress, courseGrade})
			})
			await gradeStudentsAction(courseId, grades, selectedAccount, eventId, dispatch)
            setIsWorking(false)
            setStudentGrades({} as any)
        } else {
            EventListenerService.notify("error", 'fields not populated!')
        }
    }

    return (
        <ContentShell title={course.name}>
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
					func1={noop}
					isAdmin={undefined}
                />
            </Container>
			<Button
				text='Grade students'
				onClick={gradeStudents}
				disabled={!gradeEnabled}
				isLoading={isWorking}
			/>
        </ContentShell>
    )
}
