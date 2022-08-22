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
        const courses = await faculty.methods.getProfessorSubjects(professorAddr, eventId).call(); //TODO: change name to courses
        dispatch(setCoursesForProfessorAddr({ professorAddr, courses }))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const addCourseAction = async (title, description, startTime, endTime, venue, professorAddr, eventId, selectedAccount, dispatch) => {
    try {
        await faculty.methods.addCourse(title, description, startTime, endTime, venue, professorAddr, eventId).send({ from: selectedAccount });
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

export const enrollStudentToCourseAction = async (courseId, studentAddr, selectedAccount, dispatch) => {
    try {
        await faculty.methods.enrollCourse(courseId, studentAddr).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadStudentsAction(dispatch)
    await loadAllCoursesAction(dispatch)
}

export const gradeStudentAction = async (courseId, studentAddr, grade, selectedAccount, dispatch) => {
    try {
        await faculty.methods.gradeStudent(courseId, studentAddr, grade).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadStudentsAction(dispatch)
}