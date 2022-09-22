import path from 'path';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEventAdmin } from 'utils/userUtils'
import { emptyArray } from 'utils/commonHelper'
import { ContentShell } from 'features/Content'
import { Dialog } from 'components/Dialog'
import { LocalTable, BaseColumnModel } from 'components/Table'
import { ColumnContainer, RowContainer } from 'components/Layout'
import { Button } from 'components/Button';
import { Input } from 'components/Form'
import { addCourseAction, deleteCourseAction, editCourseAction } from 'actions/coursesActions'
import { CourseForm } from './CourseForm'

const keys = ["firstName", "lastName", "id"]

const tableColumns: BaseColumnModel[] = [
	{
		field: 'title',
		title: 'Course name',
		visible: true
	},
	{
		field: 'professorName',
		title: 'Professor name',
		visible: true
	},
	{
		field: 'numberOfStudents',
		title: 'Number of students',
		visible: true
	},
]

export const Courses = ({ event }) => {
	const routematch = useRouteMatch()
	const history = useHistory();
	const dispatch = useDispatch();
	const state = useSelector((state: any) => state);
	const isAdmin = isEventAdmin(state);
    const courses = state.courses.allCourses || emptyArray
	const professors = state.users.professors || emptyArray;
    const selectedAccount = state.eth.selectedAccount;

    const [query, setQuery] = useState('');
    const [allCourses, setAllCourses] = useState([]);
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
			setAllCourses(courses)
		},
		[courses]
	)

    useEffect(
		() => {
			const newCourses = search(allCourses, query)
			const localTableCourses: any[] = [];
			for (const course of newCourses || []) {
				let prof = professors.find(p => p.id === course.professor)
				localTableCourses.push({
					title: course.title,
					description: course.description,
					venue: course.venue,
					startTime: course.startTime,
					points: course.points,
					professorName: prof ? `${prof.firstName} ${prof.lastName}` : '---',
					professor: course.professor,
					numberOfStudents: course.students.length,
					id: course.id
				})
			}
	        setSearchedCourses(localTableCourses)
		},
		[query, search, allCourses, professors]
	)

	const onSubmit = useCallback(
		async ({ title, description, startTime, venue, points, professor }) => {
            const timeStartMs = startTime.getTime()
			await addCourseAction(title, description, timeStartMs, venue, points, professor, event.id, selectedAccount, dispatch)
			closeDialogCallback()
		},
		[selectedAccount, dispatch, event, closeDialogCallback]
	)

    const onDelete = useCallback(
		async() => {
			await deleteCourseAction(selectedCourse.id, event.id, selectedCourse.professor, selectedAccount, dispatch)
		},
		[selectedCourse, event, selectedAccount, dispatch]
	)

	const onEdit = useCallback(
		async ({ id, title, startTime, venue, points, description, professor }) => {
            const timeStartMs = startTime.getTime()
			await editCourseAction(id, title, description, timeStartMs, venue, points, professor, event.id, selectedAccount, dispatch)
			closeEditDialogCallback()
		},
		[event, selectedAccount, dispatch, closeEditDialogCallback]
	)

	const onView = useCallback(
		() => {
			history.push(path.join(routematch.url, 'read', selectedCourse.id));
		},
		[selectedCourse, history, routematch]
	)

	const selectionChangeCallback = useCallback(
		(data: any[]) => {
			setSelectedCourse(data[0] || {});
		},
		[]
	)

	return (
		<ContentShell title='Courses'>
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
						disabled={!selectedCourse?.id}
						onClick={onView}
					/>
					<Button
						text='Add'
						onClick={openDialogCallback}
						disabled={!isAdmin}
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
						disabled={selectedCourse.numberOfStudents !== 0 || !isAdmin}
					/>
				</RowContainer>
				<LocalTable
					columns={tableColumns}
					data={searchedCourses}
					rowSelectionChanged={selectionChangeCallback}
					hasPagination
					limit={5}
				/>
				{isAdmin && selectedCourse?.id &&
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
				{isAdmin &&
					<Dialog
						title='Add Course'
						onClose={closeDialogCallback}
						open={isDialogOpen}
					>
	                	<CourseForm
							event={event}
							onSubmit={onSubmit}
							onCancel={closeDialogCallback}
						/>
					</Dialog>
	            }
			</ColumnContainer>
        </ContentShell>
    )
}
