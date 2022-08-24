import React from 'react'

class CourseDetails extends React.Component {
    render() {
        const { title, description, startTime, endTime, venue } = this.props.course
        return (
            <div style={{ padding: '1rem' }}>
                <h3>{title}</h3>
                <p>{description}</p>
                <p>Start time: {startTime}</p>
                <p>End time: {endTime}</p>
                <p>Venue: {venue}</p>
                <br/>
            </div>
        )
    }
}

export default CourseDetails