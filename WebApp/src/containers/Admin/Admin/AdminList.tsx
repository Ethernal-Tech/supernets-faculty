import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAdminAction, deleteAdminAction } from 'actions/userActions'
import { isEventAdmin } from 'utils/userUtils'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { listStyles } from '../../../styles'
import Button from 'react-bootstrap/esm/Button'
import LoadingSpinner from 'components/LoadingSpinner'
import { emptyArray } from 'utils/commonHelper'
import { ContentShell } from 'features/Content';
import { Dialog } from 'components/Dialog'
import { AdminForm } from './AdminForm'

export const AdminList = () => {
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const isAdmin = isEventAdmin(state)
    const admins = state.users.admins || emptyArray
	const selectedAccount = state.eth.selectedAccount
	const selectedEvent = state.event.selectedEvent

    const [isWorking, setIsWorking] = useState(false)

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
		async (addr) => {
			addAdminAction(selectedEvent.id, addr, selectedAccount, dispatch)
		},
		[selectedAccount, dispatch, selectedEvent]
	)

    const onDelete = useCallback(
		async(adminId) => {
			setIsWorking(true)
			await deleteAdminAction(selectedEvent.id, adminId, selectedAccount, dispatch)
	        setIsWorking(false)
		},
		[selectedAccount, dispatch, selectedEvent]
	)

    return (
        <ContentShell title='Event Admins'>
            <Container>
                <Row style={listStyles.borderBottom}>
                    <Col>Address</Col>
                    <Col xs={"auto"}> </Col>
                </Row>
                {admins.map((admin, ind) => (
                    <Row key={`prof_${admin}`}
                        style={ind === admins.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                        <Col>{admin}</Col>
                        {
                            isWorking ?
                            <Col xs={"auto"}><Button className="btn btn-danger"><LoadingSpinner/></Button></Col> :
                            <Col xs={"auto"}><Button className="btn btn-danger" onClick={() => onDelete(admin)}>Delete</Button></Col>
                        }

                    </Row>
                ))}
            </Container>
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
        </ContentShell>
    )
}
