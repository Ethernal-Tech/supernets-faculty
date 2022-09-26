import path from 'path'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import EventListenerService from "utils/eventListenerService"
import { gradeStudentsAction } from 'actions/coursesActions'
import { emptyArray } from 'utils/commonHelper';
import { Button } from 'components/Button';
import { ColumnContainer, RowContainer } from 'components/Layout'
import { Input } from 'components/Form'
import { useHistory } from 'react-router-dom';
import { BaseColumnModel, LocalTable } from 'components/Table';
import { contractToGrade, gradeToContract } from 'utils/userUtils';
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
	},
	{
		field: 'grade',
		title: 'Grade',
		formatter: (cell: any) => {
			const value = cell.getValue() || 0;
			const convertedValue = value ? contractToGrade.get(String(value)) : undefined;
			return convertedValue || "Select grade";
		},
		editor: 'select',
		editorParams: {
			values: gradeToContract.map((grade, key) => {
				return {
					label: grade.grade,
					value: grade.contractGrade
				}
			})
		},
		visible: true
	}
]

export const GradeStudentsList = ({ course, event, selectedAccount }: CoursesTabProps) => {
	const history = useHistory()
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const allStudents = state.users.students || emptyArray
    const studentGradesProps = state.courses.gradesByStudentByCourse[course.id] || emptyArray
    const studentsToGradeProps = useMemo(
		() => allStudents.filter(stud => studentGradesProps.filter(sg => sg.grade > 5).some(fs => fs.studentId === stud.id)),
		[allStudents, studentGradesProps]
	)
	const courseId = course.id

    const [isWorking, setIsWorking] = useState(false);
    const [query, setQuery] = useState('');
    const [studentsToGrade, setStudentsToGrade] = useState([]);
    const [searchedStudents, setSearchedStudents] = useState<any[]>([]);
    const [studentGrades, setStudentGrades] = useState({});
	const [gradeEnabled, setGradeEnabled] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<any>({})

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
	        setStudentsToGrade(studentsToGradeProps)
		},
		[studentsToGradeProps]
	)

    useEffect(
		() => {
			const newStudents = search(studentsToGrade, query)
			const localTableStudents: any[] = [];
			for (const student of newStudents || []) {
				localTableStudents.push({
					addr: student[0],
					firstName: student.firstName,
					lastName: student.lastName,
					country: student.country,
					grade: studentGrades[student.id],
					id: student.id
				})
			}
	        setSearchedStudents(localTableStudents)
		},
		[query, search, studentsToGrade, studentGrades]
	)

    const cellEditedCallback = (cell: any) => {
		const data = cell.getData();
		const value = cell.getValue();

        let newGrades: any = studentGrades

        if (value === 0) {
            delete newGrades[data.id]
        } else {
            newGrades[data.id] = value
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
			await gradeStudentsAction(courseId, grades, selectedAccount, event.id, dispatch)
            setIsWorking(false)
            setStudentGrades({} as any)
        } else {
            EventListenerService.notify("error", 'fields not populated!')
        }
    }

	const onView = useCallback(
		() => {
			history.push(path.join('../../../', 'students', 'read', selectedStudent.id))
		},
		[selectedStudent, history]
	)

	const selectionChangeCallback = useCallback(
		(data: any[]) => {
			setSelectedStudent(data[0] || []);
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
					text={'View'}
					disabled={!selectedStudent.id}
					onClick={onView}
				/>
				<Button
					text='Grade students'
					onClick={gradeStudents}
					disabled={!gradeEnabled}
					isLoading={isWorking}
				/>
			</RowContainer>
			<LocalTable
				columns={tableColumns}
				data={searchedStudents}
				rowSelectionChanged={selectionChangeCallback}
				cellEdited={cellEditedCallback}
				hasPagination
				limit={15}
			/>
		</ColumnContainer>
    )
}
