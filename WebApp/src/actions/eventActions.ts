import faculty from '../faculty'
import reader from '../facultyReader'
import notifications from 'components/Notification/notification';

export const addEventAction = async (title, location, venue, startDate, endDate, description, account, dispatch) => {
    try {
        await faculty.methods.addEditEvent(0, title, location, venue, startDate, endDate, description).send({ from: account });
    } catch (ex) {
        if (ex instanceof Error) {
            notifications.error(ex.message)
        } else {
            notifications.error("Failed to add event")
        } 
    }
}

export const editEventAction = async (eventId, title, location, venue, startDate, endDate, description, account, dispatch) => {
    try {
        await faculty.methods.addEditEvent(eventId, title, location, venue, startDate, endDate, description).send({ from: account });
    } catch (ex) {
        if (ex instanceof Error) {
            notifications.error(ex.message)
        } else {
            notifications.error("Failed to edit event")
        } 
    }
}

export const deleteEventAction = async (eventId, account, dispatch) => {
    try {
        await faculty.methods.deleteEvent(eventId).send({ from: account });
    } catch (ex) {
        if (ex instanceof Error) {
            notifications.error(ex.message)
        } else {
            notifications.error("Failed to delete event")
        } 
    }
}

export const loadAllEventsAction = async () => {
    try {
        return await reader.methods.getAllEvents().call();
    }
    catch (ex) {
        if (ex instanceof Error) {
            notifications.error(ex.message)
        } else {
            notifications.error("Failed to load all events")
        } 
    }
}

export const loadEvent =async (eventId) => {
	try {
        return await reader.methods.getEvent(eventId).call();
    }
    catch (ex) {
        if (ex instanceof Error) {
            notifications.error(ex.message)
        } else {
            notifications.error("Failed to load event")
        } 
    }
}
