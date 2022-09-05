import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/utils'

function EventComponent({event, onEventClick}) {
    
    const date = new Date(parseInt(event.time))
    const formatedDate1 = formatDate(date)
    const formatedDate2 = formatDate(date)

    return (
        <div className='col-md-4'>
            <div className='card bg-light' style={{ margin: '0.7rem 0 0.7rem 0' }}>
                <div className='card-body'>
                    <h5 className='card-title'>{event.title}</h5>
                    <p className='card-text text-truncate'>{event.description}</p>
                    <p className='card-text'>{formatedDate1} - {formatedDate2}</p>
                    <Link className='btn btn-secondary' to={"/event"} onClick={e => onEventClick(event)}>Details</Link>
                </div>
            </div>
        </div>
    )
}

export default EventComponent