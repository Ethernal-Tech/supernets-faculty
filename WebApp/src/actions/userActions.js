import faculty from '../faculty'
import reader from '../facultyReader'
import { setStudentGrades } from '../state/coursesReducer'
import { setProfessors, setStudents, setAdmins, setUsers } from '../state/usersReducer'
import { setAdminAccount } from '../state/ethReducer'
import EventListenerService from "../utils/eventListenerService"

export const loadAdminsAction = async (eventId, dispatch) => {
    try {
        const admins = await reader.methods.getAllAdmins(eventId).call();
        dispatch(setAdmins(admins))
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadProfessorsAction = async(eventId, dispatch) => {
    try {
        const professors = await reader.methods.getAllProfessors(eventId).call();
        dispatch(setProfessors(professors))
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

const loadStudentGrades = async (students, eventId, dispatch) => {
    let gradesByCourseByStudent = []
    let gradesByStudentByCourse = []

    const courses = await reader.methods.getAllCourses(eventId).call()
    for (let i = 0; i < courses.length; ++i) {
        gradesByStudentByCourse[courses[i].id] = []
    }
    debugger
    for (let i = 0; i < students.length; ++i) {
        const student = students[i]
        const grades = await reader.methods.getStudentGrades(student.id, eventId).call()

        const gradesByCourse = []
        for (let j = 0; j < grades.length; ++j) {
            const gradeObj = grades[j]
            // gradesByCourse[gradeObj.courseId] = gradeObj.courseGrade
            gradesByCourse.push({courseId: gradeObj.courseId, grade: gradeObj.courseGrade})
            
            // gradesByStudentByCourse[gradeObj.courseId] = {
            //     ...gradesByStudentByCourse[gradeObj.courseId],
            //     [student.id]: gradeObj.courseGrade
            // }

            gradesByStudentByCourse[gradeObj.courseId].push({studentId: student.id, grade: gradeObj.courseGrade})
        }
        
        gradesByCourseByStudent[student.id] = gradesByCourse
    }

    dispatch(setStudentGrades({ gradesByCourseByStudent, gradesByStudentByCourse }))
}

export const loadStudentsAction = async (eventId, dispatch) => {
    try {
        const students = await reader.methods.getAllStudents(eventId).call();
        dispatch(setStudents(students))
        await loadStudentGrades(students, eventId, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadUsersAction = async (eventId, dispatch) => {
    try {
        const professors = await reader.methods.getAllProfessors(eventId).call();
        const students = await reader.methods.getAllStudents(eventId).call();
        const admins = await reader.methods.getAllAdmins(eventId).call();
        dispatch(setUsers({ professors, students, admins }))
        await loadStudentGrades(students, eventId, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const addAdminAction = async (eventId, addr, account, dispatch) => {
    try {
        await faculty.methods.addEventAdmin(eventId, addr,).send({ from: account });
        await loadAdminsAction(eventId, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const deleteAdminAction = async (eventId, addr, account, dispatch) => {
    try {
        await faculty.methods.deleteEventAdmin(eventId, addr,).send({ from: account });
        await loadAdminsAction(eventId, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const addProfessorAction = async (addr, firstName, lastName, country, expertise, eventId, account, dispatch) => {
    try {
        await faculty.methods.addProfessor(addr, firstName, lastName, country, expertise, eventId).send({ from: account });
        await loadProfessorsAction(eventId, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const editProfessorAction = async (addr, firstName, lastName, country, expertise, eventId, account, dispatch) => {
    try {
        await faculty.methods.editProfessor(addr, firstName, lastName, country, expertise, eventId).send({ from: account });
        await loadProfessorsAction(eventId, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const deleteProfessorAction = async (addr, eventId, account, dispatch) => {
    try {
        await faculty.methods.deleteProfessor(addr, eventId).send({ from: account });
        await loadProfessorsAction(eventId, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const addStudentAction = async (addr, firstName, lastName, country, eventId, account, dispatch) => {
    try {
        await faculty.methods.addStudent(addr, firstName, lastName, country, eventId).send({ from: account });
        await loadStudentsAction(eventId, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const editStudentAction = async (addr, firstName, lastName, country, eventId, account, dispatch) => {
    try {
        await faculty.methods.editStudent(addr, firstName, lastName, country, eventId).send({ from: account });
        await loadStudentsAction(eventId, dispatch)
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const deleteStudentAction = async (addr, eventId, account, dispatch) => {
    try {
        await faculty.methods.deleteStudent(addr, eventId).send({ from: account });
        await loadStudentsAction(eventId, dispatch)
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