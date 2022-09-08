import React from 'react'
import { connect } from 'react-redux'
import { formatDate } from '../utils/utils'
class EventDetails extends React.Component {
    constructor(props) {
        super(props)
        const startDate = new Date(parseInt(props.selectedEvent.startDate))
        this.formatedDateStart = formatDate(startDate)
        const endDate = new Date(parseInt(props.selectedEvent.endDate))
        this.formatedDateEnd = formatDate(endDate)
    }

    render() {
        const { title, description, venue, location } = this.props.selectedEvent

        return (
            <>
                <p>{title}</p>
                <p>{description}</p>
                <p>{venue}</p>
                <p>{location}</p>
                <p>{this.formatedDateStart} - {this.formatedDateEnd}</p>
                <br/>
            </>
        )
    }
}


const mapStateToProps = state => ({
    selectedEvent: state.event.selectedEvent
})

export default connect(mapStateToProps)(EventDetails)