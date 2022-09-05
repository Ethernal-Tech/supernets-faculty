import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { addEventAction, loadAllEventsAction, setSelectedEventAction } from '../actions/eventActions'
import EventComponent from '../components/EventComponent'
import AddEventComponent from '../components/AddEventComponent'
import { isUserAdmin } from '../utils/userUtils'


function EventList(props) {
    useEffect(() => {
        props.loadAllEvents()
    }, [])
    
    const onEventClick = (event) => {
        props.setSelectedEvent(event)
    }

    const onSubmit = async (title, location, venue, time, description) => props.addEvent(title, location, venue, time, description, props.selectedAccount)

    return (
        <div style={{ padding: '1rem' }}>            
            <div className='container col-md-8'>
                <h2 className='text-center'>Events</h2>
                <div className='row hidden-md-up'>
                {
                    props.events.map((event) => (
                        <EventComponent event={event} onEventClick={onEventClick}/>
                    ))
                }
                </div>
            </div>
            {
                props.isAdmin && 
                <AddEventComponent onSubmit={onSubmit} />
            }
        </div>
    )
}

const mapStateToProps = state => {
    const isAdmin = isUserAdmin(state)
    return {
        events: state.event.allEvents || [],
        selectedAccount: state.eth.selectedAccount,
        isAdmin,
    }
}

const mapDispatchToProps = dispatch => ({
    loadAllEvents: () => loadAllEventsAction(dispatch),
    setSelectedEvent: (event) => setSelectedEventAction(event, dispatch),
    addEvent: (title, location, venue, time, description, account) => addEventAction(title, location, venue, time, description, account, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(EventList)