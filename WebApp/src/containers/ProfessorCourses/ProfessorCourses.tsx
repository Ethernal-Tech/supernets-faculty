import path from 'path';
import { useHistory } from 'react-router-dom';
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEventAdmin } from 'utils/userUtils'
import { addCourseAction, editCourseAction, deleteCourseAction, loadProfessorCoursesAction } from 'actions/coursesActions'
import { BaseColumnModel, LocalTable } from 'components/Table'
import { ColumnContainer, RowContainer } from 'components/Layout'
import { Button } from 'components/Button';
import { Dialog } from 'components/Dialog'
import { Input } from 'components/Form'
import { CourseForm } from '../Event/Courses/CourseForm'
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

export const ProfessorCourses = ({ professor, event, viewCourseRoutePrefix }) => {
	const history = useHistory();
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)

	const [courseToDelete, setCourseToDelete] = useState({});
	const selectedAccount = state.eth.selectedAccount
	const professorId = professor?.id
    const allCourses = state.courses.allCourses || emptyArray
    const professorCoursesIds = (professorId ? state.courses.coursesByProfessorAddr[professorId] : undefined) || emptyArray
	const isAdmin = isEventAdmin(state)

    const courses = useMemo(
		() => allCourses.filter(x => professorCoursesIds.some(y => y === x.id)),
		[allCourses, professorCoursesIds]
	)

    const [query, setQuery] = useState('');
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
			loadProfessorCoursesAction(professorId, event.id, dispatch)
		},
		[professorId, event.id, dispatch]
	);

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
			await addCourseAction(title, description, startTimeMs, venue, points, professorId, event.id, selectedAccount, dispatch)
			closeDialogCallback()
		},
		[dispatch, professorId, selectedAccount, event.id, closeDialogCallback]
	)

	const onDelete = useCallback(
		async () => {
			setCourseToDelete(selectedCourse.id)
			await deleteCourseAction(selectedCourse.id, event.id, professorId, selectedAccount, dispatch)
			setCourseToDelete({})
		},
		[selectedCourse, event, professorId, selectedAccount, dispatch]
	)

	const onView = useCallback(
		() => {
			history.push(path.join(viewCourseRoutePrefix, selectedCourse.id));
		},
		[selectedCourse, history, viewCourseRoutePrefix]
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
			await editCourseAction(id, title, description, startTimeMs, venue, points, professorId, event.id, selectedAccount, dispatch)
			closeEditDialogCallback()
		},
		[event, selectedAccount, professorId, dispatch, closeEditDialogCallback]
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
					disabled={!selectedCourse.id || courseToDelete === selectedCourse.id}
					onClick={onView}
				/>
				{isAdmin &&
					<Button
						text='Add'
						onClick={openDialogCallback}
					/>
				}
				{isAdmin &&
					<Button
						text='Edit'
						disabled={!selectedCourse.id || courseToDelete === selectedCourse.id}
						onClick={openEditDialogCallback}
					/>
				}
				{isAdmin &&
					<Button
						text='Delete'
						color='destructive'
						onClick={onDelete}
						disabled={!selectedCourse.id || selectedCourse.numberOfStudents > 0 || courseToDelete === selectedCourse.id}
						tooltip={selectedCourse.numberOfStudents > 0 ? 'Course with enrolled students cannot be deleted' : ''}
					/>
				}
			</RowContainer>
			<LocalTable
				columns={tableColumns}
				data={searchedCourses}
				rowSelectionChanged={selectionChangeCallback}
				hasPagination
				limit={15}
			/>

			{isAdmin &&
				<Dialog
					title='Add Course'
					onClose={closeDialogCallback}
					open={isDialogOpen}
				>
                	<CourseForm
						event={event}
						professorId={ professorId }
						onSubmit={onSubmit}
						onCancel={closeDialogCallback}
					/>
				</Dialog>
            }

			{isAdmin && selectedCourse.id &&
				<Dialog
					title='Edit Course'
					onClose={closeEditDialogCallback}
					open={isEditDialogOpen}
				>
					<CourseForm
						event={event}
						course={selectedCourse}
						onSubmit={onEdit}
						onCancel={closeEditDialogCallback}
					/>
				</Dialog>
			}
		</ColumnContainer>
    )
}
