import React from 'react'
import { Link } from 'react-router-dom'

function EventComponent({event, onEventClick}) {
    
    return (
        <div className='col-md-4'>
            <div className='card bg-light' style={{ margin: '0.7rem 0 0.7rem 0' }}>
                <div className='card-body'>
                    <h5 className='card-title'>{event.title}</h5>
                    <p className='card-text'>{event.description}</p>
                    <p className='card-text'>{event.time}</p>
                    <Link className='btn btn-secondary' to={"/event"} onClick={e => onEventClick(event)}>Details</Link>
                </div>
            </div>
        </div>
    )
}

export default EventComponent