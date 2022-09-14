import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProfessorAction, deleteProfessorAction, editProfessorAction } from 'actions/userActions'
import { isEventAdmin } from 'utils/userUtils'
import { emptyArray } from 'utils/commonHelper'
import { ContentShell } from 'features/Content'
import { Dialog } from 'components/Dialog'
import { ProfessorForm } from '../UserForm'
import { LocalTable, BaseColumnModel } from 'components/Table'
import { ColumnContainer, RowContainer } from 'components/Layout'
import { Button } from 'components/Button';
import { Input } from 'components/Form'
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

export const ProfessorList = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const state = useSelector((state: any) => state);
	const isAdmin = isEventAdmin(state);
	const professors = state.users.professors || emptyArray;
    const selectedAccount = state.eth.selectedAccount;
    const selectedEvent = state.event.selectedEvent;

    const [query, setQuery] = useState('');
    const [allProfessors, setAllProfessors] = useState([]);
	const [searchedProfessors, setSearchedProfessors] = useState<any[]>([]);
	const [selectedProfessor, setSelectedProfessor] = useState<any>({})

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
			setAllProfessors(professors)
		},
		[professors]
	)

    useEffect(
		() => {
			const newProfessors = search(allProfessors, query)
			const localTableProfessors: any[] = [];
			for (const professor of newProfessors || []) {
				localTableProfessors.push({
					addr: professor[0],
					firstName: professor.firstName,
					lastName: professor.lastName,
					country: professor.country,
					expertise: professor.expertise,
					id: professor.id
				})
			}
	        setSearchedProfessors(localTableProfessors)
		},
		[query, search, allProfessors]
	)

	const onSubmit = useCallback(
		async ({ addr, firstName, lastName, country, expertise }) => {
			addProfessorAction(addr, firstName, lastName, country, expertise, selectedEvent.id, selectedAccount, dispatch)
		},
		[selectedAccount, dispatch, selectedEvent]
	)

    const onDelete = useCallback(
		async() => {
			await deleteProfessorAction(selectedProfessor.id, selectedEvent.id, selectedAccount, dispatch)
		},
		[selectedProfessor, selectedEvent, selectedAccount, dispatch]
	)

	const onEdit = useCallback(
		async ({ addr, firstName, lastName, country, expertise }: any) => {
			await editProfessorAction(addr, firstName, lastName, country, expertise, selectedEvent.id, selectedAccount, dispatch)
		},
		[selectedEvent, selectedAccount, dispatch]
	)

	const onView = useCallback(
		() => {
			navigate(`/professor?prof=${selectedProfessor.id}`)
		},
		[selectedProfessor, navigate]
	)

	const selectionChangeCallback = useCallback(
		(data: any[]) => {
			setSelectedProfessor(data[0] || {});
		},
		[]
	)

	return (
		<ContentShell title='Professors'>
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
						text={'Courses'}
						disabled={!selectedProfessor?.id}
						onClick={onView}
					/>
					<Button
						text='Create'
						onClick={openDialogCallback}
						disabled={!isAdmin}
					/>
					<Button
						text='Edit'
						disabled={!selectedProfessor?.id || !isAdmin}
						onClick={openEditDialogCallback}
					/>
					<Button
						text='Delete'
						color='destructive'
						onClick={onDelete}
						disabled={!selectedProfessor?.id || !isAdmin}
					/>
				</RowContainer>
				<LocalTable
					columns={tableColumns}
					data={searchedProfessors}
					rowSelectionChanged={selectionChangeCallback}
					hasPagination
					limit={5}
				/>
				{isAdmin && selectedProfessor?.id &&
					<Dialog
						title='Edit Professor'
						onClose={closeEditDialogCallback}
						open={isEditDialogOpen}
					>
	                	<ProfessorForm
							user={selectedProfessor}
							onSubmit={onEdit}
							onCancel={closeEditDialogCallback}
						/>
					</Dialog>
	            }
				{isAdmin &&
					<Dialog
						title='Add Professor'
						onClose={closeDialogCallback}
						open={isDialogOpen}
					>
	                	<ProfessorForm
							onSubmit={onSubmit}
							onCancel={closeDialogCallback}
						/>
					</Dialog>
	            }
			</ColumnContainer>
        </ContentShell>
    )
}
