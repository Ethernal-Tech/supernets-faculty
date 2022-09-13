import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEventAdmin } from 'utils/userUtils'
import { addCourseAction, deleteCourseAction, loadProfessorCoursesAction } from 'actions/coursesActions'
import { ContentShell } from 'features/Content';
import { BaseColumnModel, LocalTable } from 'components/Table'
import { ColumnContainer, RowContainer } from 'components/Layout'
import { Button } from 'components/Button';
import { Dialog } from 'components/Dialog'
import { Input } from 'components/Form'
import { CourseForm } from './CourseForm'
import { useNavigate } from 'react-router-dom';
import { emptyArray } from 'utils/commonHelper';

const keys = ["title"]

const tableColumns: BaseColumnModel[] = [
	{
		field: 'courseName',
		title: 'Course name',
		visible: true
	},
	{
		field: 'numberOfStudents',
		title: 'Number of students',
		visible: true
	}
]

export const ProfessorCourses = ({ professor, selectedAccount }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const professorAddr = professor?.id
    const allCourses = state.courses.allCourses || emptyArray
    const professorCoursesIds = (professorAddr ? state.courses.coursesByProfessorAddr[professorAddr] : undefined) || []
    const coursesProps = allCourses.filter(x => professorCoursesIds.some(y => y === x.id))
    const isAdmin = isEventAdmin(state)
	const selectedEvent = state.event.selectedEvent

    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [searchedCourses, setSearchedCourses] = useState<any[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<any>({})

	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const openDialogCallback = useCallback(
		() => setIsDialogOpen(true),
		[]
	)

	const closeDialogCallback = useCallback(
		() => setIsDialogOpen(false),
		[]
	)

    const search = useCallback(
		(data, query) => {
	        return data.filter(item => keys.some(key => item[key].toLowerCase().includes(query.toLowerCase())))
		},
		[]
	)

    useEffect(
		() => {
			loadProfessorCoursesAction(professor.id, selectedEvent.id, dispatch)
		},
		[professor.id, selectedEvent.id, dispatch]
	);

	useEffect(
		() => {
			setCourses(coursesProps)
		},
		[coursesProps]
	)

    useEffect(
		() => {
			const newCourses = search(courses, query)
			const localTableCourses: any[] = [];
			for (const course of newCourses || []) {
				localTableCourses.push({
					title: course.title,
					numberOfStudents: course.students.length,
					id: course.id
				})
			}
	        setSearchedCourses(localTableCourses)
		},
		[query, search, courses]
	)

    const onSubmit = useCallback(
		async ({ title, description, startTime, venue, points }) => {
			await addCourseAction(title, description, startTime, venue, points, professor.id, selectedEvent.id, selectedAccount, dispatch)
		},
		[dispatch, professor, selectedAccount, selectedEvent.id]
	)

	const onDelete = useCallback(
		async () => {
			await deleteCourseAction(selectedCourse.id, selectedEvent.id, professor.id, selectedAccount, dispatch)
		},
		[selectedCourse, selectedEvent, professor, selectedAccount, dispatch]
	)

	const onView = useCallback(
		() => {
			navigate(`/course?courseId=${selectedCourse.id}`)
		},
		[selectedCourse, navigate]
	)

	const selectionChangeCallback = useCallback(
		(data: any[]) => {
			setSelectedCourse(data[0] || {});
		},
		[]
	)

    return (
        <ContentShell title={professor.name}>
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
						text='Create'
						onClick={openDialogCallback}
						disabled={!isAdmin}
					/>
					<Button
						text={'View'}
						disabled={!selectedCourse?.id}
						onClick={onView}
					/>
					<Button
						text='Delete'
						color='destructive'
						onClick={onDelete}
						disabled={!selectedCourse?.id || !isAdmin}
					/>
				</RowContainer>
				<LocalTable
					columns={tableColumns}
					data={searchedCourses}
					rowSelectionChanged={selectionChangeCallback}
					hasPagination
					limit={5}
				/>
				{/* Tooltip Delete: Course with enrolled students cannot be deleted */}

				{isAdmin &&
					<Dialog
						title='Add Course'
						onClose={closeDialogCallback}
						open={isDialogOpen}
					>
	                	<CourseForm
							onSubmit={onSubmit}
							onCancel={closeDialogCallback}
						/>
					</Dialog>
	            }
			</ColumnContainer>
        </ContentShell>
    )
}
