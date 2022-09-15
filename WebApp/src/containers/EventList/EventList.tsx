import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addEventAction, loadAllEventsAction, setSelectedEventAction, editEventAction, deleteEventAction } from 'actions/eventActions'
import { Dialog } from 'components/Dialog'
import { emptyArray } from 'utils/commonHelper'
import { EventComponent } from './EventComponent'
import { EventForm } from './EventForm'
import { isEventAdmin } from 'utils/userUtils';
import { ContentShell } from 'features/Content';
import VerticalSeparator from 'components/Layout/Separator/VerticalSeparator'
import { Button } from 'components/Button';
import { ColumnContainer, RowContainer } from 'components/Layout'

export const EventList = () => {
	const dispatch = useDispatch();
	// TODO:mika create RootState instead of any on all places where useSelector is used
	const state = useSelector((state: any) => state)
	const isAdmin = isEventAdmin(state);
	const events = state.event.allEvents || emptyArray
	const selectedAccount = state.eth.selectedAccount;

	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const openDialogCallback = useCallback(
		() => setIsDialogOpen(true),
		[]
	)

	const closeDialogCallback = useCallback(
		() => setIsDialogOpen(false),
		[]
	)

	useEffect(
		() => {
			loadAllEventsAction(dispatch)
		},
		[dispatch]
	)

	const onEventClick = useCallback(
		(event) => {
			setSelectedEventAction(event, dispatch)
		},
		[dispatch]
	)

	const onEventEdit = useCallback(
		async (eventId, title, location, venue, startDate, endDate, description) => {
			editEventAction(eventId, title, location, venue, startDate, endDate, description, selectedAccount, dispatch)
		},
		[selectedAccount, dispatch]
	)

	const onEventDelete = useCallback(
		async (eventId) => {
			deleteEventAction(eventId, selectedAccount, dispatch)
		},
		[selectedAccount, dispatch]
	)

	const onSubmit = useCallback(
		async (title, location, venue, startDate, endDate, description) => {
			await addEventAction(title, location, venue, startDate, endDate, description, selectedAccount, dispatch)
		},
		[selectedAccount, dispatch]
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
		<>
			<VerticalSeparator margin='medium' />
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
		</>
	)
}
