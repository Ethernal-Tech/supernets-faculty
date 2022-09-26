import faculty from '../faculty'
import planBCertificate from 'planBCertificate'
import { setStudentCertificates } from '../state/certificatesReducer'
import notifications from 'components/Notification/notification'

export const generateCertificateAction = async (studentAddr, selectedAccount, ipfsURI, eventId) => {

    try {
        await faculty.methods.generateCertificate(studentAddr, ipfsURI, eventId).send({ from: selectedAccount });
    }
    catch (ex) {
        notifications.error("Failed to generate certificate. " + ex.message)
    }
}

export const loadStudentCertificateAction = async (studentId, eventId, dispatch) => {
    try {
        const certificate = await planBCertificate.methods.getCertificateData(studentId, eventId).call();
        dispatch(setStudentCertificates({ studentId, certificate }))
    }
    catch (ex) {
        // It's ok if this throws exception
        //EventListenerService.notify("error", ex)
    }
}