import faculty from '../faculty'
import { setProfessors, setStudents, setUsers } from '../state/usersReducer'

export const loadUsersAction = async dispatch => {
    const professors = await faculty.methods.getAllProfessors().call();
    const students = await faculty.methods.getAllStudents().call();
    dispatch(setUsers({ professors, students }))
}

export const addProfessorAction = async (name, addr, account, dispatch) => {
    await faculty.methods.addProfessor(addr, name).send({ from: account });
    const professors = await faculty.methods.getAllProfessors().call();
    dispatch(setProfessors(professors))
}

export const addStudentAction = async (name, addr, account, dispatch) => {
    await faculty.methods.addStudent(addr, name).send({ from: account });
    const students = await faculty.methods.getAllStudents().call();
    dispatch(setStudents(students))
}