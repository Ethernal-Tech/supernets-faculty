import faculty from '../faculty'
import { setAllCourses, setStudentCourses, setCoursesForProfessorAddr } from '../state/coursesReducer'
import EventListenerService from "../utils/eventListenerService"
import { loadProfessorsAction, loadStudentsAction } from './userActions';

export const loadAllCoursesAction = async (eventId, dispatch) => {
    try {
        const courses = await faculty.methods.getAllCourses(eventId).call();
        dispatch(setAllCourses(courses))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadProfessorCoursesAction = async (professorAddr, eventId, dispatch) => {
    try {
        const courses = await faculty.methods.getProfessorCourses(professorAddr, eventId).call();
        dispatch(setCoursesForProfessorAddr({ professorAddr, courses }))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const addCourseAction = async (title, description, startTime, endTime, venue, professorAddr, points, eventId, selectedAccount, dispatch) => {
    try {
        await faculty.methods.addCourse(title, description, startTime, endTime, venue, professorAddr, points, eventId).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadProfessorsAction(eventId, dispatch)
    await loadAllCoursesAction(eventId, dispatch)
    await loadProfessorCoursesAction(professorAddr, eventId, dispatch)
}

export const generateCertificateAction = async (studentAddr, selectedAccount, ipfsURI) => {

    try {
        await faculty.methods.generateCertificate(studentAddr, ipfsURI).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadStudentCoursesAction = async (accountAddress, eventId, dispatch) => {
    try {
        const courses = await faculty.methods.getStudentCourses(accountAddress, eventId).call();
        dispatch(setStudentCourses({ studentId: accountAddress, courses }))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const enrollStudentsToCourseAction = async (courseId, studentAddrs, selectedAccount, eventId, dispatch) => {
    try {
        await faculty.methods.enrollCourseMultiple(courseId, studentAddrs).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadStudentsAction(eventId, dispatch)
    await loadAllCoursesAction(eventId, dispatch)
}

export const gradeStudentsAction = async (courseId, studentGrades, selectedAccount, eventId, dispatch) => {
    try {
        await faculty.methods.gradeStudents(courseId, studentGrades).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadStudentsAction(eventId, dispatch)
    await loadAllCoursesAction(eventId, dispatch)
}