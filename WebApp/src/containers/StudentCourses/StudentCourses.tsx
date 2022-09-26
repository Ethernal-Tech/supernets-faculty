import path from 'path';
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadStudentCoursesAction } from 'actions/coursesActions'
import { generateCertificateAction, loadStudentCertificateAction } from 'actions/certificateActions'
import { contractToGrade, isEventAdmin }  from 'utils/userUtils'
import { createMetadata, uploadMetadata } from 'utils/nftUtils'
import { BaseColumnModel, LocalTable } from 'components/Table';
import { ColumnContainer } from 'components/Layout'
import { Input } from 'components/Form'
import { Button } from 'components/Button'
import { emptyArray, emptyObject } from 'utils/commonHelper'
import { useHistory } from 'react-router-dom'

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
	const history = useHistory()
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
    const isAdmin = isEventAdmin(state)

	const selectedAccount = state.eth.selectedAccount;
	const allCourses = state.courses.allCourses || emptyArray
	const gradesByCourse = (state.courses.gradesByCourseByStudent || emptyObject)[student.id] || emptyArray

    const courses = useMemo(
		() => ((state.courses.studentCourses || emptyObject)[student.id] || emptyArray).map(x => {
	        const course = allCourses.find(y => y.id === x)
	        const grade = gradesByCourse.find(y => y.courseId === x)
	        return {
	            ...course,
	            grade
	        }
		}),
		[allCourses, gradesByCourse, state.courses.studentCourses, student]
	)

    const [query, setQuery] = useState('');
    const [searchedCourses, setSearchedCourses] = useState<any[]>([]);
	const professors = state.users.professors || emptyArray;

    const certificateData = useMemo(
		() => {
            return (state.certificates || undefined)?.studentCertificates[student.id] || undefined
		},
		[state.certificates.studentCertificates, student.id]
	)

    useEffect(
		() => {
			loadStudentCoursesAction(student.id, event.id, dispatch)
			if (!certificateData) {
				loadData()
			}
		},
		[student, event, certificateData, dispatch]
	);

    const loadData = async () => {
        loadStudentCertificateAction(student.id, event.id, dispatch)
    }

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
					professorName: prof ? `${prof.firstName} ${prof.lastName}` : '---',
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
	        const metadata = createMetadata(student, event.title, courses)
	        console.log(metadata)
	        const ipfsUri = await uploadMetadata(metadata);

			console.log(ipfsUri)
	        await generateCertificateAction(student.id, selectedAccount, ipfsUri, event.id)
		},
		[event.id, selectedAccount, student, courses]
	)

	const onViewCertificate = useCallback(
		async () => {
			history.push(path.join('../../', 'certificate', student.id))
		},
		[history]
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
				limit={15}
			/>
			{isAdmin && 
				<Button
					text='Produce certificate'
					onClick={onGenerateCertificate}
					disabled={courses.length === 0 || courses.filter(course => contractToGrade.get(course.grade.grade) === '---').length > 0}
					tooltip={(courses.length === 0 || courses.filter(course => contractToGrade.get(course.grade.grade) === '---').length > 0) ? "Student didn't pass all courses." : ''}
				/>
			}
			{certificateData &&
				<Button
					text='View certificate'
					onClick={onViewCertificate}
				/>
			}
		</ColumnContainer>
    )
}
