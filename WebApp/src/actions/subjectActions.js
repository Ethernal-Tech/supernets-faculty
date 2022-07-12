import faculty from '../faculty'
import { setAllSubjects, setSubjectsForProfessorAddr } from '../state/subjectsReducer'
import EventListenerService from "../utils/eventListenerService"
import { loadProfessorsAction, loadStudentsAction } from './userActions';

export const loadAllSubjectsAction = async dispatch => {
    try {
        const subjects = await faculty.methods.getAllSubjects().call();
        dispatch(setAllSubjects(subjects))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadProfessorSubjectsAction = async (professorAddr, dispatch) => {
    try {
        const subjects = await faculty.methods.getProfessorSubjects(professorAddr).call();
        dispatch(setSubjectsForProfessorAddr({ professorAddr, subjects }))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const addSubjectAction = async (subjectName, professorAddr, selectedAccount, dispatch) => {
    try {
        await faculty.methods.addSubject(subjectName, professorAddr).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadProfessorsAction(dispatch)
    await loadAllSubjectsAction(dispatch)
    await loadProfessorSubjectsAction(professorAddr, dispatch)
}

export const enrollStudentToSubjectAction = async (subjectId, studentAddr, selectedAccount, dispatch) => {
    try {
        await faculty.methods.enrollSubject(subjectId, studentAddr).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadStudentsAction(dispatch)
    await loadAllSubjectsAction(dispatch)
}

export const gradeStudentAction = async (subjectId, studentAddr, grade, selectedAccount, dispatch) => {
    try {
        await faculty.methods.gradeStudent(subjectId, studentAddr, grade).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }

    await loadStudentsAction(dispatch)
}