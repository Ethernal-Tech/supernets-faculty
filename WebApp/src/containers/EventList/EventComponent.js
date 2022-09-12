import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/utils'
import Button from 'react-bootstrap/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

export const EventComponent = ({ event, onEventClick, onEventDelete, isAdmin }) => {
    const [isWorking, setIsWorking] = useState(false);

    const startDate = new Date(parseInt(event.startDate))
    const formatedStartDate = formatDate(startDate)
    const endDate = new Date(parseInt(event.endDate))
    const formatedEndDate = formatDate(endDate)

    const onDeleteClick = async () => {
        setIsWorking(true)
        await onEventDelete(event.id)
        setIsWorking(false)
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>Event with courses cannot be deleted.</Tooltip>
    );

    return (
        <div className='col-md-4'>
            <div className='card bg-light' style={{ margin: '0.7rem 0 0.7rem 0' }}>
                <div className='card-body'>
                    <h5 className='card-title'>{event.title}</h5>
                    <p className='card-text text-truncate'>{event.description}</p>
                    <p className='card-text'>{formatedStartDate} - {formatedEndDate}</p>
                    <Link
						className={isWorking ? 'btn btn-secondary disabled' : 'btn btn-secondary' }
						to={"/event"}
						onClick={e => onEventClick(event)}
					>
						Details
					</Link>
                    {isAdmin &&
                        <>
                            {isWorking ?
                                <Button className="btn btn-secondary" type="submit" disabled><LoadingSpinner/></Button> :
                                <>
                                    {event.coursesIds.length === 0 ?
                                        <Button variant="danger" onClick={onDeleteClick}>Delete</Button> :
                                        <OverlayTrigger
                                            placement="right"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={renderTooltip}
                                        >
                                            <Button variant="btn btn-secondary">Delete</Button>
                                        </OverlayTrigger>
                                    }
                                </>

                            }
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
