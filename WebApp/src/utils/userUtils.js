import { USER_ROLES } from './constants'

export const isUserAdmin = state => {
    return state.eth.selectedAccount === state.eth.adminAccount
}

export const isEventAdmin = state => {
    return state.eth.selectedAccount === state.eth.adminAccount || (state.users.admins && state.users.admins.includes(state.eth.selectedAccount))
}

export const gradeToContract = [
    { grade: '', contractGrade: 0 },
    { grade: '10', contractGrade: 5 },
    { grade: '9', contractGrade: 4 }, 
    { grade: '8', contractGrade: 3 },
    { grade: '7', contractGrade: 2 },
    { grade: '6', contractGrade: 1 },
    { grade: 'FAILED', contractGrade: 6 },
];

export const contractToGrade = new Map([
    ["1", "6"],
    ["2", "7"],
    ["3", "8"],
    ["4", "9"],
    ["5", "10"],
    ["6", "Failed"],
    ["7", "---"],
  ]);

export const getUserRole = state => {
    const { selectedAccount, adminAccount } = state.eth
    const eventAdmins = state.users.admins || [];
    const professors = state.users.professors || []
    const students = state.users.students || []
    if (!selectedAccount) {
        return USER_ROLES.GUEST
    }

    if ((adminAccount && adminAccount.toLowerCase() === selectedAccount.toLowerCase()) || eventAdmins.includes(selectedAccount)) {
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