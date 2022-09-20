import faculty from '../faculty'
import reader from '../facultyReader'
import EventListenerService from "utils/eventListenerService"

export const addEventAction = async (title, location, venue, startDate, endDate, description, account, dispatch) => {
    try {
        await faculty.methods.addEditEvent(0, title, location, venue, startDate, endDate, description).send({ from: account });
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const editEventAction = async (eventId, title, location, venue, startDate, endDate, description, account, dispatch) => {
    try {
        await faculty.methods.addEditEvent(eventId, title, location, venue, startDate, endDate, description).send({ from: account });
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const deleteEventAction = async (eventId, account, dispatch) => {
    try {
        await faculty.methods.deleteEvent(eventId).send({ from: account });
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadAllEventsAction = async () => {
    try {
        return await reader.methods.getAllEvents().call();
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadEvent =async (eventId) => {
	try {
        return await reader.methods.getEvent(eventId).call();
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}
