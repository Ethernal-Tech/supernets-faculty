import React from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { addEventAction, loadAllEventsAction, setSelectedEventAction } from '../actions/eventActions'
import EventComponent from '../components/EventComponent'
import AddEventComponent from '../components/AddEventComponent'
import { isUserAdmin } from '../utils/userUtils'


class EventList extends React.Component {

    componentDidMount() {
        this.props.loadAllEvents()
    }

    onEventClick(e, props, event){
        props.setSelectedEvent(event)
    }

    onSubmit = async (title, location, venue, time, description) => {
        this.props.addEvent(title, location, venue, time, description, this.props.selectedAccount)
    }

    render() {
        const { events } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>Events</h4>
                
                {
                    events.map((event, idx) => (
                        <li key={idx}>
                            <Link to={"/event"} onClick={e => this.onEventClick(e, this.props, event)}>
                                <EventComponent event={event}/>
                            </Link>
                        </li>
                    ))
                }
                {
                    this.props.isAdmin && 
                    <AddEventComponent onSubmit={this.onSubmit} />
                }
            </div>
        )
    }
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