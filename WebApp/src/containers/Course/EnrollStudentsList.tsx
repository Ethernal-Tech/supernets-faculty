import path from 'path'
import { useMemo, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import notifications from 'components/Notification/notification'
import { enrollStudentsToCourseAction } from 'actions/coursesActions'
import { emptyArray } from 'utils/commonHelper'
import { Button } from 'components/Button';
import { Input } from 'components/Form'
import { ColumnContainer, RowContainer } from 'components/Layout'
import { useHistory } from 'react-router-dom';
import { BaseColumnModel, LocalTable } from 'components/Table'
import { CoursesTabProps } from './Course';

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

export const EnrollStudentsList = ({ course, event, selectedAccount }: CoursesTabProps) => {
	const history = useHistory()
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const allStudents = state.users.students || emptyArray
    const studentsToEnrollProps = useMemo(
		() => allStudents.filter(stud => !course.students.some(y => y === stud.id)),
		[allStudents, course]
	)

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
				await enrollStudentsToCourseAction(course.id, studentAddrs, selectedAccount, event.id, dispatch)
	            setIsWorking(false)
	            setSelectedStudents([])
	        }
	        else {
				notifications.error("Fields are not populated")
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
				<div style={{ width: '200px', textAlign: 'end'}}>
					<Input
						value={query}
						placeholder='Search...'
						onChange={setQuery}
					/>
				</div>
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
