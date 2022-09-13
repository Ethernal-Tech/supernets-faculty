import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addStudentAction, deleteStudentAction, editStudentAction } from 'actions/userActions'
import { isEventAdmin } from 'utils/userUtils'
import { emptyArray } from 'utils/commonHelper'
import { ContentShell } from 'features/Content';
import { Dialog } from 'components/Dialog'
import { UserForm } from '../UserForm'
import { BaseColumnModel, LocalTable } from 'components/Table'
import { Input } from 'components/Form'
import { ColumnContainer, RowContainer } from 'components/Layout';
import { Button } from 'components/Button';
import { useNavigate } from 'react-router-dom';

const keys = ["firstName", "lastName", "id"]

const tableColumns: BaseColumnModel[] = [
	{
		field: 'name',
		title: 'Name',
		visible: true,
		formatter: (cell: any) => {
			const data = cell.getData();
			return `${data.firstName} ${data.lastName}`
		}
	},
	{
		field: 'addr',
		title: 'Address',
		visible: true
	}
]

export const StudentList = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const state = useSelector((state: any) => state);
	const isAdmin = isEventAdmin(state);
	const students = state.users.students || emptyArray
	const selectedAccount = state.eth.selectedAccount
	const selectedEvent = state.event.selectedEvent

    const [query, setQuery] = useState('');
    const [allStudents, setAllStudents] = useState([]);
    const [searchedStudents, setSearchedStudents] = useState<any>([]);
	const [selectedStudent, setSelectedStudent] = useState<any>({})

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
			setAllStudents(students)
		},
		[students]
	)

    useEffect(
		() => {
			const newStudents = search(allStudents, query)
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
		[query, search, allStudents]
	)

    const onSubmit = useCallback(
		async ({ addr, firstName, lastName, country }) => {
			addStudentAction(addr, firstName, lastName, country, selectedEvent.id, selectedAccount, dispatch)
		},
		[selectedEvent, selectedAccount, dispatch]
	)

    const onDelete = useCallback(
		async() => {
			await deleteStudentAction(selectedStudent.id, selectedEvent.id, selectedAccount, dispatch)
		},
		[selectedStudent, selectedEvent, selectedAccount, dispatch]
	)

	const onEdit = useCallback(
		async ({ addr, firstName, lastName, country, expertise }: any) => {
			await editStudentAction(addr, firstName, lastName, country, selectedEvent.id, selectedAccount, dispatch)
		},
		[selectedEvent, selectedAccount, dispatch]
	)

	const onView = useCallback(
		() => {
			navigate(`/student?stud=${selectedStudent.id}`)
		},
		[selectedStudent, navigate]
	)

	const selectionChangeCallback = useCallback(
		(data: any[]) => {
			setSelectedStudent(data[0] || {});
		},
		[]
	)

    return (
        <ContentShell title='Students'>
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
						disabled={!selectedStudent?.id}
						onClick={onView}
					/>
					<Button
						text='Change'
						disabled={!selectedStudent?.id || !isAdmin}
						onClick={openEditDialogCallback}
					/>
					<Button
						text='Delete'
						color='destructive'
						onClick={onDelete}
						disabled={!selectedStudent?.id || !isAdmin}
					/>
				</RowContainer>
				<LocalTable
					columns={tableColumns}
					data={searchedStudents}
					rowSelectionChanged={selectionChangeCallback}
					hasPagination
					limit={5}
				/>
				{isAdmin && selectedStudent?.id &&
					<Dialog
						title='Edit Student'
						onClose={closeEditDialogCallback}
						open={isEditDialogOpen}
					>
	                	<UserForm
							user={selectedStudent}
							onSubmit={onEdit}
							onCancel={closeEditDialogCallback}
						/>
					</Dialog>
	            }
				{isAdmin &&
					<Dialog
						title='Add Student'
						onClose={closeDialogCallback}
						open={isDialogOpen}
					>
	                	<UserForm
							onSubmit={onSubmit}
							onCancel={closeDialogCallback}
						/>
					</Dialog>
	            }
			</ColumnContainer>
        </ContentShell>
    )
}
