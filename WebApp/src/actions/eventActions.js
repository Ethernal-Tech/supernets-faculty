import faculty from '../faculty'
import reader from '../facultyReader'
import { setEvents, setSelectedEvent } from '../state/eventReducer'
import EventListenerService from "../utils/eventListenerService"

export const addEventAction = async (title, location, venue, startDate, endDate, description, account, dispatch) => {
    try {
        await faculty.methods.addEvent(title, location, venue, startDate, endDate, description).send({ from: account });
        await loadAllEventsAction(dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const deleteEventAction = async(eventId, account, dispatch) => {
    try {
        await faculty.methods.deleteEvent(eventId).send({ from: account });
        await loadAllEventsAction(dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadAllEventsAction = async dispatch => {
    try {
        const events = await reader.methods.getAllEvents().call();
        await dispatch(setEvents(events))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const setSelectedEventAction = async (event, dispatch) => {
    try {
        await dispatch(setSelectedEvent(event))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}