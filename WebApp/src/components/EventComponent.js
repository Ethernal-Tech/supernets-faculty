import React from 'react'

class EventComponent extends React.Component {
    render() {
        const { title, venue } = this.props.event
        return (
            <>
                <p>{title}</p>
                <p>{venue}</p>
                <br/>
            </>
        )
    }
}

export default EventComponent