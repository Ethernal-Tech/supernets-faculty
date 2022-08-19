import faculty from '../faculty'
import { setStudentGrades } from '../state/coursesReducer'
import { setProfessors, setStudents, setUsers } from '../state/usersReducer'
import { setAdminAccount } from '../state/ethReducer'
import EventListenerService from "../utils/eventListenerService"

export const loadProfessorsAction = async(eventId, dispatch) => {
    try {
        const professors = await faculty.methods.getAllProfessors(eventId).call();
        dispatch(setProfessors(professors))
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

const loadStudentGrades = async (students, eventId, dispatch) => {
    let gradesByCourseByStudent = {}
    let gradesByStudentByCourse = {}
    for (let i = 0; i < students.length; ++i) {
        const student = students[i]
        const grades = await faculty.methods.getStudentGrades(student.id, eventId).call()

        const gradesByCourse = {}
        for (let j = 0; j < grades.length; ++j) {
            const gradeObj = grades[j]
            gradesByCourse[gradeObj.id] = gradeObj.grade
            
            gradesByStudentByCourse[gradeObj.id] = {
                ...gradesByStudentByCourse[gradeObj.id],
                [student.id]: gradeObj.grade
            }
        }

        gradesByCourseByStudent[student.id] = gradesByCourse
    
    }

    dispatch(setStudentGrades({ gradesByCourseByStudent, gradesByStudentByCourse }))
}

export const loadStudentsAction = async (eventId, dispatch) => {
    try {
        const students = await faculty.methods.getAllStudents(eventId).call();
        dispatch(setStudents(students))
        await loadStudentGrades(students, eventId, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadUsersAction = async (eventId, dispatch) => {
    try {
        const professors = await faculty.methods.getAllProfessors(eventId).call();
        const students = await faculty.methods.getAllStudents(eventId).call();
        dispatch(setUsers({ professors, students }))
        await loadStudentGrades(students, eventId, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const addProfessorAction = async (name, addr, account, dispatch) => {
    try {
        await faculty.methods.addProfessor(addr, name).send({ from: account });
        await loadProfessorsAction(dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const addStudentAction = async (name, addr, account, dispatch) => {
    try {
        await faculty.methods.addStudent(addr, name).send({ from: account });
        await loadStudentsAction(dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadAdminAccountAction = async (dispatch) => {
    try {
        const adminAccount = await faculty.methods.admin().call();
        dispatch(setAdminAccount(adminAccount))
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}