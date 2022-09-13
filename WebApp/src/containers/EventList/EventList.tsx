import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addEventAction, loadAllEventsAction, setSelectedEventAction, deleteEventAction } from 'actions/eventActions'
import { Dialog } from 'components/Dialog'
import { emptyArray } from 'utils/commonHelper'
import { EventComponent } from './EventComponent'
import { AddEventComponent } from './AddEventComponent'
import { isEventAdmin } from 'utils/userUtils';
import { ContentShell } from 'features/Content';

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
		() => {
			return events.map((event, idx) => (
				<EventComponent key={idx} event={event} onEventClick={onEventClick} onEventDelete={onEventDelete} isAdmin={isAdmin} />

			))
		},
		[events, onEventClick, onEventDelete, isAdmin]
	)

	return (
		<ContentShell>
			<div className='container col-md-8'>
				<h2 className='text-center'>Events</h2>
				<div className='row hidden-md-up'>
					{eventsContent}
				</div>
				{isAdmin &&
					<>
						<div className='text-end'>
							<button
								className='btn btn-secondary'
								onClick={openDialogCallback}
							>
								Add event
							</button>
						</div>
						{isDialogOpen &&
							<Dialog
								title='Add Event'
								onClose={closeDialogCallback}
								open={true}
							>
								<AddEventComponent
									onSubmit={onSubmit}
									onCancel={closeDialogCallback}
								/>
							</Dialog>
						}
					</>
				}
			</div>
		</ContentShell>
	)
}
