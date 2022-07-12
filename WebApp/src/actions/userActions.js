import faculty from '../faculty'
import { setProfessors, setStudents, setUsers } from '../state/usersReducer'
import EventListenerService from "../utils/eventListenerService"

export const loadUsersAction = async dispatch => {
    try {
        const professors = await faculty.methods.getAllProfessors().call();
        const students = await faculty.methods.getAllStudents().call();
        dispatch(setUsers({ professors, students }))
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const addProfessorAction = async (name, addr, account, dispatch) => {
    try {
        await faculty.methods.addProfessor(addr, name).send({ from: account });
        const professors = await faculty.methods.getAllProfessors().call();
        dispatch(setProfessors(professors))
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const addStudentAction = async (name, addr, account, dispatch) => {
    try {
        await faculty.methods.addStudent(addr, name).send({ from: account });
        const students = await faculty.methods.getAllStudents().call();
        dispatch(setStudents(students))
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}