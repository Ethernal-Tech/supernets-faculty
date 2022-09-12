import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addEventAction, loadAllEventsAction, setSelectedEventAction } from 'actions/eventActions'
import { Dialog } from 'components/Dialog'
import { emptyArray } from 'pages/commonHelper'
import { EventComponent } from './EventComponent'
import { AddEventComponent } from './AddEventComponent'

export const EventList = () => {
	const dispatch = useDispatch();
	// TODO:mika create RootState instead of any
	const { event, eth } = useSelector((state: any) => state)
	const events = event.allEvents || emptyArray
	const selectedAccount = eth.selectedAccount;

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

	const onSubmit = useCallback(
		async (title, location, venue, startDate, endDate, description) => {
			await addEventAction(title, location, venue, startDate, endDate, description, selectedAccount, dispatch)
		},
		[selectedAccount, dispatch]
	)

	const eventsContent = useMemo(
		() => {
			return events.map((event, idx) => (
				<EventComponent key={idx} event={event} onEventClick={onEventClick}/>
			))
		},
		[events, onEventClick]
	)

	return (
		<div style={{ padding: '1rem' }}>
			<div className='container col-md-8'>
				<h2 className='text-center'>Events</h2>
				<div className='row hidden-md-up'>
					{eventsContent}
				</div>
				{
					// isAdmin &&
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
		</div>
	)
}
