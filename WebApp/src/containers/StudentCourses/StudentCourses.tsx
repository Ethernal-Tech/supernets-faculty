import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadStudentCoursesAction } from 'actions/coursesActions'
import { generateCertificateAction } from 'actions/certificateActions'
import { contractToGrade }  from 'utils/userUtils'
import { createMetadata, uploadMetadata } from 'utils/nftUtils'
import { BaseColumnModel, LocalTable } from 'components/Table';
import { ColumnContainer } from 'components/Layout'
import { Input } from 'components/Form'
import { Button } from 'components/Button'
import { emptyArray, emptyObject } from 'utils/commonHelper'

const keys = ["title"]

const tableColumns: BaseColumnModel[] = [
	{
		field: 'title',
		title: 'Course name',
		visible: true
	},
	{
		field: 'professorName',
		title: "Professor's Name",
		visible: true
	},
	{
		field: 'grade',
		title: "Grade",
		visible: true
	}
]

export const StudentCourses = ({ student, event }) => {
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const selectedAccount = state.eth.selectedAccount;
    const allStudents = state.users.students || emptyArray
	const studentFallback = student || allStudents.find(x => x.id === selectedAccount)
	const allCourses = state.courses.allCourses || emptyArray
	const gradesByCourse = (state.courses.gradesByCourseByStudent || emptyObject)[studentFallback.id] || emptyArray

    const studentCourses = useMemo(
		() => ((state.courses.studentCourses || emptyObject)[studentFallback.id] || emptyArray).map(x => {
	        const course = allCourses.find(y => y.id === x)
	        const grade = gradesByCourse.find(y => y.courseId === x)
	        return {
	            ...course,
	            grade
	        }
		}),
		[allCourses, gradesByCourse, state.courses.studentCourses, studentFallback]
	)

    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [searchedCourses, setSearchedCourses] = useState<any[]>([]);
	const professors = state.users.professors || emptyArray;

    useEffect(
		() => {
			loadStudentCoursesAction(studentFallback.id, event.id, dispatch)
		},
		[studentFallback, event, dispatch]
	);

    useEffect(
		() => {
            setCourses(studentCourses)
		},
		[studentCourses]
	);

    const search = useCallback(
		(data, query) => {
	        return data.filter(item => keys.some(key => item[key].toLowerCase().includes(query.toLowerCase())))
		},
		[]
	)

    useEffect(
		() => {
			const newCourses = search(courses, query)
			const localTableCourses: any[] = [];
			for (const course of newCourses || []) {
				let prof = professors.find(p => p.id === course.professor)
				localTableCourses.push({
					title: course.title,
					professorName: `${prof.firstName} ${prof.lastName}`,
					grade: contractToGrade.get(course.grade.grade),
					id: course.id
				})
			}
	        setSearchedCourses(localTableCourses)
		},
		[query, search, courses, professors]
	)

    const onGenerateCertificate = useCallback(
		async () => {
	        const metadata = createMetadata(studentFallback, studentCourses)
	        console.log(metadata)
	        const ipfsUri = await uploadMetadata(metadata);

			console.log(ipfsUri)
	        await generateCertificateAction(studentFallback.id, selectedAccount, ipfsUri, event.id)
		},
		[event.id, selectedAccount, studentFallback, studentCourses]
	)

    return (
		<ColumnContainer margin='medium'>
			<div style={{ width: '200px'}}>
				<Input
					value={query}
					placeholder='Search...'
					onChange={setQuery}
				/>
			</div>
			<LocalTable
				columns={tableColumns}
				data={searchedCourses}
				hasPagination
				limit={5}
			/>
			<Button
				text='Produce certificate'
				onClick={onGenerateCertificate}
			/>
		</ColumnContainer>
    )
}
