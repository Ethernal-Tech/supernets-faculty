import path from 'path'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'components/Button'
import { contractToGrade }  from '../../utils/userUtils'
import { disenrollStudentsToCourseAction } from 'actions/coursesActions'
import EventListenerService from "../../utils/eventListenerService"
import { emptyArray, emptyObject } from 'utils/commonHelper'
import { BaseColumnModel, LocalTable } from 'components/Table'
import { ColumnContainer, RowContainer } from 'components/Layout'
import { Input } from 'components/Form'
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { CoursesTabProps } from './Course'

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
	},
	{
		field: 'grade',
		title: 'Grade',
		visible: true
	}
]

export const CourseStudents = ({ course, event, selectedAccount }: CoursesTabProps) => {
	const history = useHistory()
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
    const allStudents = state.users.students || emptyArray
    const courseStudents = useMemo(
		() => allStudents.filter(stud => course.students.some(y => y === stud.id)),
		[allStudents, course]
	)
    const gradesByStudent = (state.courses.gradesByStudentByCourse || emptyObject)[course.id] || emptyObject

    const [isWorking, setIsWorking] = useState(false);
    const [query, setQuery] = useState('');
    const [studentsToDisenroll, setStudentsToDisenroll] = useState<any[]>([]);
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
	        setStudentsToDisenroll(courseStudents)
		},
		[courseStudents]
	)

    const getStudentGrade = useCallback(
		(studentId) => {
	        return contractToGrade.get((gradesByStudent.find(x => x.studentId === studentId) || {}).grade)
		},
		[gradesByStudent]
	)

    useEffect(
		() => {
			const newStudents = search(studentsToDisenroll, query)
			const localTableStudents: any[] = [];
			for (const student of newStudents || []) {
				localTableStudents.push({
					addr: student[0],
					firstName: student.firstName,
					lastName: student.lastName,
					country: student.country,
					grade: getStudentGrade(student.id),
					id: student.id
				})
			}
	        setSearchedStudents(localTableStudents)
		},
		[query, search, studentsToDisenroll, getStudentGrade]
	)

    const disenrollStudents = useCallback(
		async() => {
	        if (selectedStudents.length !== 0){
	            setIsWorking(true)
				const studentAddrs = selectedStudents.map(stud => stud.id)
				await disenrollStudentsToCourseAction(course.id, studentAddrs, selectedAccount, event.id, dispatch)
	            setIsWorking(false)
	            setSelectedStudents([])
	        }
	        else {
	            EventListenerService.notify("error", 'fields not populated!')
	        }
		},
		[course.id, dispatch, event.id, selectedAccount, selectedStudents]
	)

	const onView = useCallback(
		() => {
			if (selectedStudents.length === 1) {
				history.push(path.join('../../../', 'students', 'read', selectedStudents[0].id))
			}
		},
		[selectedStudents, history]
	)

	const selectionChangeCallback = useCallback(
		(data: any[]) => {
			setSelectedStudents(data || []);
		},
		[]
	)

    return (
		<ColumnContainer margin='medium'>
			<RowContainer>
				<div style={{ width: '200px'}}>
					<Input
						value={query}
						placeholder='Search...'
						onChange={setQuery}
					/>
				</div>
				<Button
					text='View'
					disabled={selectedStudents.length !== 1}
					onClick={onView}
				/>
				<Button
					text={`Disenroll ${selectedStudents.length} students`}
					onClick={disenrollStudents}
					disabled={selectedStudents.filter(s => s.grade === '---').length === 0}
					tooltip={(selectedStudents.filter(s => s.grade === '---').length === 0 && selectedStudents.length !== 0) ? 'Students with grade cannot be disenrolled' : ''}
					isLoading={isWorking}
				/>
			</RowContainer>
			<LocalTable
				columns={tableColumns}
				data={searchedStudents}
				rowSelectionChanged={selectionChangeCallback}
				hasPagination
				limit={5}
				options={{
					selectable: true
				}}
			/>
		</ColumnContainer>
    )
}