import { USER_ROLES } from './constants'

export const getUserRole = state => {
    const { selectedAccount, adminAccount } = state.eth
    const professors = state.users.professors || []
    const students = state.users.students || []
    if (!selectedAccount) {
        return USER_ROLES.GUEST
    }

    if (adminAccount && adminAccount.toLowerCase() === selectedAccount.toLowerCase()) {
        return USER_ROLES.ADMIN
    }

    if (professors.some(x => x.id.toLowerCase() === selectedAccount.toLowerCase())) {
        return USER_ROLES.PROFESSOR
    }

    if (students.some(x => x.id.toLowerCase() === selectedAccount.toLowerCase())) {
        return USER_ROLES.STUDENT
    }

    return USER_ROLES.GUEST
}

export const getUserName = state => {
    const userRole = getUserRole(state)
    switch (userRole) {
        case USER_ROLES.PROFESSOR:
            const professor = (state.users.professors || [])
                .find(x => x.id.toLowerCase() === state.eth.selectedAccount.toLowerCase())
            return professor ? professor.name : ''
        case USER_ROLES.STUDENT:
            const student = (state.users.students || [])
                .find(x => x.id.toLowerCase() === state.eth.selectedAccount.toLowerCase())
            return student ? student.name : ''
        case USER_ROLES.ADMIN:
            return 'admin'
        default:
            return 'guest'            
    }    
}