import faculty from '../faculty'
import reader from '../facultyReader'
import EventListenerService from "utils/eventListenerService"
import { setSelectedEvent } from 'state/eventReducer';

export const getEventAction = () => {
	const event: any = [
		"1",
		"Event1",
		"NS",
		"FTN",
		"1662681600000",
		"1663200000000",
		" Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description",
		[
			"0x1d5389A562228203FcB23F19E9eF04385b676c26"
		],
		[
			"0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
			"0x5885314C3A4eb71Ad5ADDf4c767BBa890fd66De6",
			"0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C",
			"0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7"
		],
		[
			"0xcB4ba64C6e205451e795e7f5831EA9E56436c0d0",
			"0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678",
			"0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C",
			"0x583031D1113aD414F02576BD6afaBfb302140225",
			"0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC",
			"0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
			"0xAE7Dd4464a9567234Ec328AE8fA3a8Bb1BaE6383"
		],
		[
			"1",
			"2",
			"6",
			"13",
			"14"
		],
		true
	];

	(event as any).adminsAddresses = [
		"0x1d5389A562228203FcB23F19E9eF04385b676c26"
	];
	(event as any).coursesIds = [
		"1",
		"2",
		"6",
		"13",
		"14"
	];
	(event as any).description = " Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description Event description";
	(event as any).endDate = "1663200000000";
	(event as any).exist = true;
	(event as any).id ="1";
	(event as any).location = "NS";
	(event as any).professorsAddresses = ['0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', '0x5885314C3A4eb71Ad5ADDf4c767BBa890fd66De6', '0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C', '0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7'];
	(event as any).startDate = "1662681600000";
	(event as any).studentsAddresses = ['0xcB4ba64C6e205451e795e7f5831EA9E56436c0d0', '0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678', '0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C', '0x583031D1113aD414F02576BD6afaBfb302140225', '0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC', '0xdD870fA1b7C4700F2BD7f44238821C26f7392148', '0xAE7Dd4464a9567234Ec328AE8fA3a8Bb1BaE6383'];
	(event as any).title = "Event1";
	(event as any).venue = "FTN";

	return event
}

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

export const setSelectedEventAction = async (event, dispatch) => {
    try {
        await dispatch(setSelectedEvent(event))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}
