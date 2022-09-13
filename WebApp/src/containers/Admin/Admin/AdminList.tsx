import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAdminAction, deleteAdminAction } from 'actions/userActions'
import { isEventAdmin } from 'utils/userUtils'
import { emptyArray } from 'utils/commonHelper'
import { ContentShell } from 'features/Content';
import { Dialog } from 'components/Dialog'
import { AdminForm } from './AdminForm'
import { BaseColumnModel, LocalTable } from 'components/Table'
import { ColumnContainer, RowContainer } from 'components/Layout'
import { Button } from 'components/Button';

const tableColumns: BaseColumnModel[] = [
	{
		field: 'addr',
		title: 'Address',
		visible: true
	}
]

export const AdminList = () => {
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const isAdmin = isEventAdmin(state)
    const admins = state.users.admins || emptyArray
	const selectedAccount = state.eth.selectedAccount
	const selectedEvent = state.event.selectedEvent

	const convertedAdmins = useMemo(
		() => {
			return (admins as any[]).map((item) => {
				return {
					id: item,
					addr: item
				}
			})
		},
		[admins]
	)

	const [selectedAdmin, setSelectedAdmin] = useState<any>({})
    const [isDeleting, setIsDeleting] = useState(false)

	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const openDialogCallback = useCallback(
		() => setIsDialogOpen(true),
		[]
	)

	const closeDialogCallback = useCallback(
		() => setIsDialogOpen(false),
		[]
	)

    const onSubmit = useCallback(
		async ({ addr }) => {
			addAdminAction(selectedEvent.id, addr, selectedAccount, dispatch)
		},
		[selectedAccount, dispatch, selectedEvent]
	)

    const onDelete = useCallback(
		async() => {
			setIsDeleting(true)
			await deleteAdminAction(selectedEvent.id, selectedAdmin.id, selectedAccount, dispatch)
	        setIsDeleting(false)
		},
		[selectedAdmin, selectedAccount, dispatch, selectedEvent]
	)

	const selectionChangeCallback = useCallback(
		(data: any[]) => {
			setSelectedAdmin(data[0] || {});
		},
		[]
	)

    return (
        <ContentShell title='Event Admins'>
			<ColumnContainer margin='medium'>
				<RowContainer>
					<Button
						text='Create'
						onClick={openDialogCallback}
						disabled={!isAdmin}
					/>
					<Button
						text='Delete'
						color='destructive'
						onClick={onDelete}
						disabled={!selectedAdmin?.id || !isAdmin}
						isLoading={isDeleting}
					/>
				</RowContainer>
				<LocalTable
					columns={tableColumns}
					data={convertedAdmins}
					rowSelectionChanged={selectionChangeCallback}
					hasPagination
					limit={5}
				/>
				{isAdmin &&
					<Dialog
						title='Add Admin'
						onClose={closeDialogCallback}
						open={isDialogOpen}
					>
	                	<AdminForm
							onSubmit={onSubmit}
							onCancel={closeDialogCallback}
						/>
					</Dialog>
	            }
			</ColumnContainer>
        </ContentShell>
    )
}
