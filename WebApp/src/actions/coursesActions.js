import faculty from '../faculty'
import reader from '../facultyReader'
import { setAllCourses, setStudentCourses, setCoursesForProfessorAddr } from '../state/coursesReducer'
import EventListenerService from "../utils/eventListenerService"
import { loadProfessorsAction, loadStudentsAction } from './userActions';

export const loadAllCoursesAction = async (eventId, dispatch) => {
    try {
        const courses = await reader.methods.getAllCourses(eventId).call();
        dispatch(setAllCourses(courses))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadProfessorCoursesAction = async (professorAddr, eventId, dispatch) => {
    try {
        const courses = await reader.methods.getProfessorCourses(professorAddr, eventId).call();
        dispatch(setCoursesForProfessorAddr({ professorAddr, courses }))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const addCourseAction = async (title, description, startTime, venue, points, professorAddr, eventId, selectedAccount, dispatch) => {
    try {
        debugger
        await faculty.methods.addCourse(title, description, startTime, venue, points, professorAddr, eventId).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadProfessorsAction(eventId, dispatch)
    await loadAllCoursesAction(eventId, dispatch)
    await loadProfessorCoursesAction(professorAddr, eventId, dispatch)
}

export const editCourseAction = async (courseId, title, description, startTime, venue, points, professorAddr, eventId, selectedAccount, dispatch) => {
    try {
        debugger
        await faculty.methods.editCourse(courseId, title, description, startTime, venue, points, professorAddr, eventId).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadProfessorsAction(eventId, dispatch)
    await loadAllCoursesAction(eventId, dispatch)
    await loadProfessorCoursesAction(professorAddr, eventId, dispatch)
}

export const deleteCourseAction = async (courseId, eventId, professorAddr, selectedAccount, dispatch) => {
    try {
        await faculty.methods.deleteCourse(courseId, eventId).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadProfessorsAction(eventId, dispatch)
    await loadAllCoursesAction(eventId, dispatch)
    if (professorAddr){
        await loadProfessorCoursesAction(professorAddr, eventId, dispatch)
    }
}

export const generateCertificateAction = async (studentAddr, selectedAccount, ipfsURI, eventId) => {

    try {
        await faculty.methods.generateCertificate(studentAddr, ipfsURI, eventId).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadStudentCoursesAction = async (accountAddress, eventId, dispatch) => {
    try {
        const courses = await reader.methods.getStudentCourses(accountAddress, eventId).call();
        dispatch(setStudentCourses({ studentId: accountAddress, courses }))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const enrollStudentsToCourseAction = async (courseId, studentAddrs, selectedAccount, eventId, dispatch) => {
    try {
        await faculty.methods.enrollCourseMultiple(courseId, studentAddrs, eventId).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadStudentsAction(eventId, dispatch)
    await loadAllCoursesAction(eventId, dispatch)
}

export const disenrollStudentsToCourseAction = async (courseId, studentAddrs, selectedAccount, eventId, dispatch) => {
    try {
        await faculty.methods.disenrollCourseMultiple(courseId, studentAddrs, eventId).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadStudentsAction(eventId, dispatch)
    await loadAllCoursesAction(eventId, dispatch)
}

export const gradeStudentsAction = async (courseId, studentGrades, selectedAccount, eventId, dispatch) => {
    try {
        await faculty.methods.gradeStudents(courseId, studentGrades, eventId).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadStudentsAction(eventId, dispatch)
    await loadAllCoursesAction(eventId, dispatch)
}