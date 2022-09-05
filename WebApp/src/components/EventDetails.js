import React from 'react'
import { connect } from 'react-redux'
import { formatDate } from '../utils/utils'
class EventDetails extends React.Component {
    constructor(props) {
        super(props) 
        const date = new Date(parseInt(props.selectedEvent.time))
        this.formatedDate = formatDate(date)
    }

    render() {
        const { title, description, venue, location } = this.props.selectedEvent

        return (
            <>
                <p>{title}</p>
                <p>{description}</p>
                <p>{venue}</p>
                <p>{location}</p>
                <p>{this.formatedDate}</p>
                <br/>
            </>
        )
    }
}


const mapStateToProps = state => ({
    selectedEvent: state.event.selectedEvent
})

export default connect(mapStateToProps)(EventDetails)