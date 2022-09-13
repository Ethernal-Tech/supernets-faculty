import { useMemo, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EventListenerService from "utils/eventListenerService"
import { enrollStudentsToCourseAction } from 'actions/coursesActions'
import { ContentShell } from 'features/Content';
import { emptyArray } from 'utils/commonHelper'
import { Button } from 'components/Button';
import { Input } from 'components/Form'
import { ColumnContainer, RowContainer } from 'components/Layout'
import { useNavigate } from 'react-router-dom';
import { BaseColumnModel, LocalTable } from 'components/Table'

const keys = ["firstName", "lastName", "id"]

const tableColumns: BaseColumnModel[] = [
	{
		field: 'name',
		title: 'Student name',
		visible: true,
		formatter: (cell: any) => {
			const data = cell.getData();
			return `${data.firstName} ${data.lastName}`
		}
	},
	{
		field: 'addr',
		title: 'Student address',
		visible: true
	}
]

export const EnrollStudentsList = ({ courseId, selectedAccount }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const allStudents = state.users.students || emptyArray
    const courses = state.courses.allCourses || emptyArray
    const course = courses.find(x => x.id === courseId)
    const studentsToEnrollProps = useMemo(
		() => allStudents.filter(stud => !course.students.some(y => y === stud.id)),
		[allStudents, course]
	)
	const eventId = state.event.selectedEvent.id

    const [isWorking, setIsWorking] = useState(false);
    const [query, setQuery] = useState('');
    const [studentsToEnroll, setStudentsToEnroll] = useState<any[]>([]);
    const [searchedStudents, setSearchedStudents] = useState<any[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

    const search = useCallback(
		(data, query) => {
	        if (query !== '') {
	            let filteredData = data
	            let multiQuery = query.split(' ')
	            multiQuery.forEach(mq => { if (mq === '') return
	                filteredData = filteredData.filter(item => keys.some(key => item[key].toLowerCase().includes(mq.toLowerCase())))
	            })

	            return filteredData
	        }

	        return data
		},
		[]
	)

    useEffect(
		() => {
	        setStudentsToEnroll(studentsToEnrollProps)
		},
		[studentsToEnrollProps]
	);

    useEffect(
		() => {
			const newStudents = search(studentsToEnroll, query)
			const localTableStudents: any[] = [];
			for (const student of newStudents || []) {
				localTableStudents.push({
					addr: student[0],
					firstName: student.firstName,
					lastName: student.lastName,
					country: student.country,
					id: student.id
				})
			}
	        setSearchedStudents(localTableStudents)
		},
		[query, search, studentsToEnroll]
	)

    const enrollStudents = useCallback(
		async() => {
	        if (selectedStudents.length !== 0){
	            setIsWorking(true)
				const studentAddrs = selectedStudents.map(stud => stud.id)
				await enrollStudentsToCourseAction(course.id, studentAddrs, selectedAccount, eventId, dispatch)
	            setIsWorking(false)
	            setSelectedStudents([])
	        }
	        else {
	            EventListenerService.notify("error", 'fields not populated!')
	        }
		},
		[course.id, dispatch, eventId, selectedAccount, selectedStudents]
	)

	const onView = useCallback(
		() => {
			if (selectedStudents.length === 1) {
				navigate(`/student?stud=${selectedStudents[0].id}`)
			}
		},
		[selectedStudents, navigate]
	)

	const selectionChangeCallback = useCallback(
		(data: any[]) => {
			setSelectedStudents(data || []);
		},
		[]
	)

    return (
        <ContentShell title={`Enroll students - ${course.title}`}>
			<ColumnContainer margin='medium'>
				<div style={{ width: '200px'}}>
					<Input
						value={query}
						placeholder='Search...'
						onChange={setQuery}
					/>
				</div>
				<RowContainer>
					<Button
						text={'View'}
						disabled={selectedStudents.length !== 1}
						onClick={onView}
					/>
					<Button
						text={`Enroll ${selectedStudents.length} students`}
						onClick={enrollStudents}
						disabled={selectedStudents.length === 0}
						isLoading={isWorking}
					/>
				</RowContainer>
			</ColumnContainer>
			<LocalTable
				columns={tableColumns}
				data={searchedStudents}
				rowSelectionChanged={selectionChangeCallback}
				hasPagination
				limit={5}
			/>
        </ContentShell>
    )
}
