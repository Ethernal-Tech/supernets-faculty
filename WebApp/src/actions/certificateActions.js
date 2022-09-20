import faculty from '../faculty'
import planBCertificate from 'planBCertificate'
import { setStudentCertificates } from '../state/certificatesReducer'
import EventListenerService from "../utils/eventListenerService"

export const generateCertificateAction = async (studentAddr, selectedAccount, ipfsURI, eventId) => {

    try {
        await faculty.methods.generateCertificate(studentAddr, ipfsURI, eventId).send({ from: selectedAccount });
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}

export const loadStudentCertificateAction = async (studentId, eventId, dispatch) => {
    try {
        const certificate = await planBCertificate.methods.getCertificateData(studentId, eventId).call();
        dispatch(setStudentCertificates({ studentId, certificate }))
    }
    catch (ex) {
        EventListenerService.notify("error", ex)
    }
}