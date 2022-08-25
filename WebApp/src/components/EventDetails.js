import React from 'react'
import { connect } from 'react-redux'

class EventDetails extends React.Component {
    render() {
        const { title, description, venue, location, time } = this.props.selectedEvent
        return (
            <>
                <p>{title}</p>
                <p>{description}</p>
                <p>{venue}</p>
                <p>{location}</p>
                <p>{time}</p>
                <br/>
            </>
        )
    }
}


const mapStateToProps = state => ({
    selectedEvent: state.event.selectedEvent
})

export default connect(mapStateToProps)(EventDetails)