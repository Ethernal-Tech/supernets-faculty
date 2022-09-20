import path from 'path';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addEventAction, loadAllEventsAction, editEventAction, deleteEventAction } from 'actions/eventActions'
import { Dialog } from 'components/Dialog'
import { EventComponent } from './EventComponent'
import { EventForm } from './EventForm'
import { isEventAdmin } from 'utils/userUtils';
import { ContentShell } from 'features/Content';
import { Button } from 'components/Button';
import { ColumnContainer, RowContainer } from 'components/Layout'

export const Events = () => {
	const routematch = useRouteMatch()
	const history = useHistory()
	const dispatch = useDispatch();
	// TODO:mika create RootState instead of any on all places where useSelector is used
	const state = useSelector((state: any) => state)
	const isAdmin = isEventAdmin(state);
	const selectedAccount = state.eth.selectedAccount;

	const [events, setEvents] = useState<any[]>([])
	const [loading, setLoading] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const openDialogCallback = useCallback(
		() => setIsDialogOpen(true),
		[]
	)

	const closeDialogCallback = useCallback(
		() => setIsDialogOpen(false),
		[]
	)

	const fetchEventsCallback = useCallback(
		async () => {
			setLoading(true)
			const response = await loadAllEventsAction()
			setEvents(response)
			setLoading(false)
		},
		[]
	)

	useEffect(
		() => {
			fetchEventsCallback()
		},
		[fetchEventsCallback]
	)

	const onEventClick = useCallback(
		(event) => {
			history.push(path.join(routematch.url, 'read', event.id));
		},
		[history, routematch]
	)

	const onEventEdit = useCallback(
		async (eventId, title, location, venue, startDate, endDate, description) => {
            const timeStartMs = startDate.getTime()
            const timeEndMs = endDate.getTime()
			await editEventAction(eventId, title, location, venue, timeStartMs, timeEndMs, description, selectedAccount, dispatch)
			fetchEventsCallback()
		},
		[selectedAccount, dispatch, fetchEventsCallback]
	)

	const onEventDelete = useCallback(
		async (eventId) => {
			await deleteEventAction(eventId, selectedAccount, dispatch)
			fetchEventsCallback()
		},
		[selectedAccount, dispatch, fetchEventsCallback]
	)

	const onSubmit = useCallback(
		async ({ title, location, venue, startDate, endDate, description }) => {
            const timeStartMs = startDate.getTime()
            const timeEndMs = endDate.getTime()
			await addEventAction(title, location, venue, timeStartMs, timeEndMs, description, selectedAccount, dispatch)
			await fetchEventsCallback()
			closeDialogCallback();
		},
		[selectedAccount, dispatch, fetchEventsCallback, closeDialogCallback]
	)

	const eventsContent = useMemo(
		() => events.map((event, idx) => (
			<EventComponent
				key={idx}
				event={event}
				onEventClick={onEventClick}
				onEventEdit={onEventEdit}
				onEventDelete={onEventDelete}
				isAdmin={isAdmin}
			/>
		)),
		[events, onEventClick, onEventEdit, onEventDelete, isAdmin]
	)

	return (
		<ContentShell title='Events'>
			<ColumnContainer>
				{isAdmin &&
					<RowContainer>
						<Button
							text='Add event'
							onClick={openDialogCallback}
						/>
						{isDialogOpen &&
							<Dialog
								title='Add Event'
								onClose={closeDialogCallback}
								open={true}
							>
								<EventForm
									onSubmit={onSubmit}
									onCancel={closeDialogCallback}
									event={undefined}
								/>
							</Dialog>
						}
					</RowContainer>
				}
				<div className='container col-md-8'>
					<div className='row hidden-md-up'>
						{eventsContent}
					</div>
				</div>
			</ColumnContainer>
		</ContentShell>
	)
}
