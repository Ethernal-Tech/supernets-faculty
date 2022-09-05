import React from 'react'

class CourseDetailsComponent extends React.Component {
    constructor(props) {
        super(props) 

        const startDate = new Date(parseInt(props.course.startTime))
        this.formatedStartDate = startDate.toLocaleString()

        const endDate = new Date(parseInt(props.course.endTime))
        this.formatedEndDate = endDate.toLocaleString()
    }

    render() {
        const { title, description, venue, points } = this.props.course
        return (
            <div style={{ padding: '1rem' }}>
                <h3>{title}</h3>
                <p>{description}</p>
                <p>Start time: {this.formatedStartDate}</p>
                <p>End time: {this.formatedEndDate}</p>
                <p>Venue: {venue}</p>
                <p>Points: {points}</p>
                <br/>
            </div>
        )
    }
}

export default CourseDetailsComponent