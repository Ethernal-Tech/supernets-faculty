import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addEventAction, loadAllEventsAction, setSelectedEventAction } from 'actions/eventActions'
import EventComponent from 'components/EventComponent'
import AddEventComponent from 'components/AddEventComponent'
import { Dialog } from 'components/Dialog'
import { emptyArray } from 'pages/commonHelper'

export const EventList = (props) => {
	const dispatch = useDispatch();
	// TODO:mika create RootState instead of any
	const state = useSelector((state: any) => state)
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

    const onSubmit = useCallback(
		async (title, location, venue, startDate, endDate, description) => {
			addEventAction(title, location, venue, startDate, endDate, description, selectedAccount, dispatch)
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
                        <Dialog
							title='Add Event'
							onClose={closeDialogCallback}
							open={isDialogOpen}
						>
                            <AddEventComponent onSubmit={onSubmit}/>
                        </Dialog>
                    </>
                }
            </div>
        </div>
    )
}
