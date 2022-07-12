import AppConfig from '../AppConfig'
import { USER_ROLES } from './constants'

export const getUserRole = (professors, students, selectedAccount) => {
    if (!selectedAccount) {
        return USER_ROLES.GUEST
    }

    if (AppConfig.adminAddress.toLowerCase() === (selectedAccount || '').toLowerCase()) {
        return USER_ROLES.ADMIN
    }

    if (professors.some(x => x.id.toLowerCase() === (selectedAccount || '').toLowerCase())) {
        return USER_ROLES.PROFESSOR
    }

    if (students.some(x => x.id.toLowerCase() === (selectedAccount || '').toLowerCase())) {
        return USER_ROLES.STUDENT
    }

    return USER_ROLES.GUEST
}