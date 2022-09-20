import path from 'path';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addStudentAction, deleteStudentAction, editStudentAction } from 'actions/userActions'
import { isEventAdmin } from 'utils/userUtils'
import { emptyArray } from 'utils/commonHelper'
import { ContentShell } from 'features/Content';
import { Dialog } from 'components/Dialog'
import { StudentForm } from './StudentForm'
import { BaseColumnModel, LocalTable } from 'components/Table'
import { Input } from 'components/Form'
import { ColumnContainer, RowContainer } from 'components/Layout';
import { Button } from 'components/Button';

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

export const Students = ({ event }) => {
	const routematch = useRouteMatch()
	const history = useHistory();
	const dispatch = useDispatch();
	const state = useSelector((state: any) => state);
	const isAdmin = isEventAdmin(state);
	const students = state.users.students || emptyArray
	const selectedAccount = state.eth.selectedAccount

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
			await addStudentAction(addr, firstName, lastName, country, event.id, selectedAccount, dispatch)
		},
		[event, selectedAccount, dispatch]
	)

    const onDelete = useCallback(
		async() => {
			await deleteStudentAction(selectedStudent.id, event.id, selectedAccount, dispatch)
		},
		[selectedStudent, event, selectedAccount, dispatch]
	)

	const onEdit = useCallback(
		async ({ addr, firstName, lastName, country, expertise }: any) => {
			await editStudentAction(addr, firstName, lastName, country, event.id, selectedAccount, dispatch)
		},
		[event, selectedAccount, dispatch]
	)

	const onView = useCallback(
		() => {
			history.push(path.join(routematch.url, 'read', selectedStudent.id));
		},
		[routematch.url, selectedStudent, history]
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
				<RowContainer>
					<div style={{ width: '200px'}}>
						<Input
							value={query}
							placeholder='Search...'
							onChange={setQuery}
						/>
					</div>
					<Button
						text='Add'
						onClick={openDialogCallback}
						disabled={!isAdmin}
					/>
					<Button
						text={'View'}
						disabled={!selectedStudent?.id}
						onClick={onView}
					/>
					<Button
						text='Edit'
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
	                	<StudentForm
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
	                	<StudentForm
							onSubmit={onSubmit}
							onCancel={closeDialogCallback}
						/>
					</Dialog>
	            }
			</ColumnContainer>
        </ContentShell>
    )
}
