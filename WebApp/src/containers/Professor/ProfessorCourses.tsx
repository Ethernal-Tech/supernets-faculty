import { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEventAdmin } from 'utils/userUtils'
import { addCourseAction, editCourseAction, deleteCourseAction, loadProfessorCoursesAction } from 'actions/coursesActions'
import { BaseColumnModel, LocalTable } from 'components/Table'
import { ColumnContainer, RowContainer } from 'components/Layout'
import { Button } from 'components/Button';
import { Dialog } from 'components/Dialog'
import { Input } from 'components/Form'
import { CourseForm } from './CourseForm'
import { useHistory } from 'react-router-dom';
import { emptyArray } from 'utils/commonHelper';

const keys = ["title"]

const tableColumns: BaseColumnModel[] = [
	{
		field: 'title',
		title: 'Course name',
		visible: true
	},
	{
		field: 'numberOfStudents',
		title: 'Number of students',
		visible: true
	}
]

export const ProfessorCourses = ({ professor, event }) => {
	const history = useHistory();
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const professors = state.users.professors || emptyArray
	const selectedAccount = state.eth.selectedAccount

	professor = professor || professors.find(x => x.id === selectedAccount)
	const professorAddr = professor?.id
    const allCourses = state.courses.allCourses || emptyArray
    const professorCoursesIds = (professorAddr ? state.courses.coursesByProfessorAddr[professorAddr] : undefined) || emptyArray
    const coursesProps = useMemo(
		() => allCourses.filter(x => professorCoursesIds.some(y => y === x.id)),
		[allCourses, professorCoursesIds]
	)
    const isAdmin = isEventAdmin(state)

    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [searchedCourses, setSearchedCourses] = useState<any[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<any>({})

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	const openEditDialogCallback = useCallback(
		() => setIsEditDialogOpen(true),
		[]
	)

	const closeEditDialogCallback = useCallback(
		() => setIsEditDialogOpen(false),
		[]
	)

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
			loadProfessorCoursesAction(professor.id, event.id, dispatch)
		},
		[professor.id, event.id, dispatch]
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
					id: course.id,
					startTime: course.startTime,
					venue: course.venue,
					points: course.points,
					description: course.description,
					professor: course.professor,
				})
			}
	        setSearchedCourses(localTableCourses)
		},
		[query, search, courses]
	)

    const onSubmit = useCallback(
		async ({ title, description, startTime, venue, points }) => {
            const startTimeMs = new Date(startTime).getTime()
			await addCourseAction(title, description, startTimeMs, venue, points, professor.id, event.id, selectedAccount, dispatch)
		},
		[dispatch, professor, selectedAccount, event.id]
	)

	const onDelete = useCallback(
		async () => {
			await deleteCourseAction(selectedCourse.id, event.id, professor.id, selectedAccount, dispatch)
		},
		[selectedCourse, event, professor, selectedAccount, dispatch]
	)

	const onView = useCallback(
		() => {
			history.push(`/course?courseId=${selectedCourse.id}`)
		},
		[selectedCourse, history]
	)

	const selectionChangeCallback = useCallback(
		(data: any[]) => {
			setSelectedCourse(data[0] || {});
		},
		[]
	)
	const onEdit = useCallback(
		async ({ id, title, startTime, venue, points, description }: any) => {
			const startTimeMs = new Date(startTime).getTime()
			await editCourseAction(id, title, description, startTimeMs, venue, points, professorAddr, event.id, selectedAccount, dispatch)
		},
		[event, selectedAccount, professorAddr, dispatch]
	)

    return (
		<ColumnContainer margin='medium'>
			<h3>Courses</h3>
			<RowContainer>
				<div style={{ width: '200px'}}>
					<Input
						value={query}
						placeholder='Search...'
						onChange={setQuery}
					/>
				</div>
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
					text='Edit'
					disabled={!selectedCourse?.id || !isAdmin}
					onClick={openEditDialogCallback}
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

			{isAdmin && selectedCourse?.id &&
				<Dialog
					title='Edit Course'
					onClose={closeEditDialogCallback}
					open={isEditDialogOpen}
				>
					<CourseForm
						course={selectedCourse}
						onSubmit={onEdit}
						onCancel={closeEditDialogCallback}
					/>
				</Dialog>
			}
		</ColumnContainer>
    )
}
