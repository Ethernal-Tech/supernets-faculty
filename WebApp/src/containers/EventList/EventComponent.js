import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from 'utils/utils'

export const EventComponent = ({ event, onEventClick }) => {
    const startDate = new Date(parseInt(event.startDate))
    const formatedDateStart = formatDate(startDate)
    const endDate = new Date(parseInt(event.endDate))
    const formatedDateEnd = formatDate(endDate)

    return (
        <div className='col-md-4'>
            <div className='card bg-light' style={{ margin: '0.7rem 0 0.7rem 0' }}>
                <div className='card-body'>
                    <h5 className='card-title'>{event.title}</h5>
                    <p className='card-text text-truncate'>{event.description}</p>
                    <p className='card-text'>{formatedDateStart} - {formatedDateEnd}</p>
                    <Link
						className='btn btn-secondary'
						to={"/event"}
						onClick={e => onEventClick(event)}
					>
						Details
					</Link>
                </div>
            </div>
        </div>
    )
}
