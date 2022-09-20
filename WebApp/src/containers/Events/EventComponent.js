import React, { useCallback, useState } from 'react'
import { formatDate } from 'utils/utils'
import { Button } from 'components/Button'
import { RowContainer } from 'components/Layout'
import VerticalSeparator from 'components/Layout/Separator/VerticalSeparator'
import { Dialog } from 'components/Dialog'
import { EventForm } from './EventForm'

export const EventComponent = ({ event, onEventClick, onEventEdit, onEventDelete, isAdmin }) => {
    const [isWorking, setIsWorking] = useState(false);
    const startDate = new Date(parseInt(event.startDate))
    const formatedStartDate = formatDate(startDate)
    const endDate = new Date(parseInt(event.endDate))
    const formatedEndDate = formatDate(endDate)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	const openEditDialogCallback = useCallback(
		() => setIsEditDialogOpen(true),
		[]
	)

	const closeEditDialogCallback = useCallback(
		() => setIsEditDialogOpen(false),
		[]
	)

	const onEditSubmit = async ({title, location, venue, startDate, endDate, description}) => {
        setIsWorking(true)
        await onEventEdit(event.id, title, location, venue, startDate, endDate, description)
        setIsWorking(false)
    }

    const onDeleteClick = async () => {
        setIsWorking(true)
        await onEventDelete(event.id)
        setIsWorking(false)
    }

	const onDetails = useCallback(
		() => {
			onEventClick(event)
		},
		[event, onEventClick]
	)

    return (
        <div className='col-md-4'>
            <div className='card' style={{ margin: '0 0 0.7rem', background: 'rgb(33,37,41)' }}>
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
							text='Edit'
							onClick={openEditDialogCallback}
						/>
						}
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
					{isAdmin &&
					<Dialog
						title='Edit Event'
						onClose={closeEditDialogCallback}
						open={isEditDialogOpen}
					>
	                	<EventForm
							onSubmit={onEditSubmit}
							onCancel={closeEditDialogCallback}
							event={event}
						/>
					</Dialog>
	            }
                </div>
            </div>
        </div>
    )
}
