import React, { useCallback, useState } from 'react'
import { formatDate } from 'utils/utils'
import { Button } from 'components/Button'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { RowContainer } from 'components/Layout'
import VerticalSeparator from 'components/Layout/Separator/VerticalSeparator'
import { noop } from 'utils/commonHelper'
import { useNavigate } from 'react-router-dom';

export const EventComponent = ({ event, onEventClick, onEventDelete, isAdmin }) => {
	const navigate = useNavigate();

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

	const onDetails = useCallback(
		() => {
			navigate(`/event`)
			onEventClick(event)
		},
		[navigate, event, onEventClick]
	)

    return (
        <div className='col-md-4'>
            <div className='card' style={{ margin: '0 0 0.7rem' }}>
                <div className='card-body'>
                    <h3 className='card-title'>{event.title}</h3>
                    <VerticalSeparator margin='small' />
					<div className='card-text text-truncate' title={event.description}>{event.description}</div>
                    <VerticalSeparator margin='small' />
					<div className='card-text'>{formatedStartDate} - {formatedEndDate}</div>
					<VerticalSeparator margin='medium' />
					<RowContainer>
						<Button
							text='Details'
							onClick={onDetails}
							isLoading={isWorking}
						/>
	                    {isAdmin &&
							<Button
								text='Delete'
								color='destructive'
								tooltip={event.coursesIds.length === 0 ? undefined : 'Event with courses cannot be deleted.'}
								disabled={event.coursesIds.length !== 0}
								onClick={onDeleteClick}
								isLoading={isWorking}
							/>
	                    }
					</RowContainer>
                </div>
            </div>
        </div>
    )
}
