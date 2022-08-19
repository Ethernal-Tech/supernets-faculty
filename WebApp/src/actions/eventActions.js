import faculty from '../faculty'
import { setEvents, setSelectedEvent } from '../state/eventReducer'
import EventListenerService from "../utils/eventListenerService"

export const loadAllEventsAction = async dispatch => {
    try {
        const events = await faculty.methods.getAllEvents().call();
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