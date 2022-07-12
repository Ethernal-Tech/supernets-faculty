import faculty from '../faculty'
import { setStudentGrades } from '../state/subjectsReducer'
import { setProfessors, setStudents, setUsers } from '../state/usersReducer'
import EventListenerService from "../utils/eventListenerService"

const loadStudentGrades = async (students, dispatch) => {
    let gradesBySubjectByStudent = {}
    let gradesByStudentBySubject = {}
    for (let i = 0; i < students.length; ++i) {
        const student = students[i]
        const grades = await faculty.methods.getStudentGrades(student.id).call()

        const gradesBySubject = {}
        for (let j = 0; j < grades.length; ++j) {
            const gradeObj = grades[j]
            gradesBySubject[gradeObj.id] = gradeObj.grade
            
            gradesByStudentBySubject[gradeObj.id] = {
                ...gradesByStudentBySubject[gradeObj.id],
                [student.id]: gradeObj.grade
            }
        }

        gradesBySubjectByStudent[student.id] = gradesBySubject
    
    }

    dispatch(setStudentGrades({ gradesBySubjectByStudent, gradesByStudentBySubject }))
}

export const loadUsersAction = async dispatch => {
    try {
        const professors = await faculty.methods.getAllProfessors().call();
        const students = await faculty.methods.getAllStudents().call();
        dispatch(setUsers({ professors, students }))
        await loadStudentGrades(students, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadProfessorsAction = async dispatch => {
    try {
        const professors = await faculty.methods.getAllProfessors().call();
        dispatch(setProfessors(professors))
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadStudentsAction = async dispatch => {
    try {
        const students = await faculty.methods.getAllStudents().call();
        dispatch(setStudents(students))
        await loadStudentGrades(students, dispatch)
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