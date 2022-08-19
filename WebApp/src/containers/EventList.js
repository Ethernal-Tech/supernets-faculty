import React from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadAllEventsAction, setSelectedEventAction } from '../actions/eventActions'
import EventComponent from '../components/EventComponent'

import { isUserAdmin } from '../utils/userUtils'


class EventList extends React.Component {

    componentDidMount() {
        this.props.loadAllEvents()
    }

    onEventClick(e, props, event){
        props.setSelectedEvent(event)
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
            </div>
        )
    }
}

const mapStateToProps = state => ({
    events: state.event.allEvents || [],
    selectedAccount: state.eth.selectedAccount,
})

const mapDispatchToProps = dispatch => ({
    loadAllEvents: () => loadAllEventsAction(dispatch),
    setSelectedEvent: (event) => setSelectedEventAction(event, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(EventList)