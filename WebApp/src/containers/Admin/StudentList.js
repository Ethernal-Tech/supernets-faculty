import React, { useEffect, useState } from 'react'
import '../../listStyles.css'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import AddUserComponent from '../../components/AddUserComponent'
import Pagination from '../../components/Pagination'
import StudentRow from '../RowComponents/StudentRow'
import { addStudentAction, deleteStudentAction } from '../../actions/userActions'
import { listStyles } from '../../styles'
import { isEventAdmin } from '../../utils/userUtils'

function StudentList(props) {

    const [query, setQuery] = useState('');
    const [allStudents, setAllStudents] = useState([]);
    const [searchedStudents, setSearchedStudents] = useState([]);

    useEffect(() => {
        let tempList = props.students
        setAllStudents(tempList)
        setSearchedStudents(search(tempList, query))
    }, [props.students])

    const onSubmit = async (ad, fn, ln, cn, _) => props.addStudent(ad, fn, ln, cn, props.selectedEvent.id, props.selectedAccount)

    const onQueryChange = ({target}) => {
        let newStudents = search(allStudents, target.value)

        setQuery(target.value)
        setSearchedStudents(newStudents)
    }

    const onDelete = async(studId) => {
        await props.deleteStudent(studId, props.selectedEvent.id, props.selectedAccount)
    }

    const keys = ["firstName", "lastName", "id"]
    const search = (data, query) => {
        if (query !== '') {
            let filteredData = data
            let multiQuery = query.split(' ')
            multiQuery.forEach(mq => { if (mq === '') return
                filteredData = filteredData.filter(item => keys.some(key => item[key].toLowerCase().includes(mq.toLowerCase())))
            })

            return filteredData
        }

        return data
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h4>Students</h4>

            <input type="text"
                id="query"
                placeholder='Search...'
                className="search"
                onChange={onQueryChange}/>

            <Container>
                <Row style={listStyles.borderBottom}>
                    <Col>Name</Col>
                    <Col>Address</Col>
                    <Col xs={"auto"}> </Col>
                    <Col xs={"auto"}> </Col>
                </Row>
                <Pagination
                    data={searchedStudents}
                    RenderComponent={StudentRow}
                    func={onDelete}
                    pageLimit={5}
                    dataLimit={5}
                />
            </Container>
            {
                props.isAdmin &&
                <AddUserComponent onSubmit={onSubmit} />
            }
        </div>
    )
}

const mapStateToProps = state => {
    const isAdmin = isEventAdmin(state)
    return {
        students: state.users.students || [],
        selectedAccount: state.eth.selectedAccount,
        selectedEvent: state.event.selectedEvent,
        isAdmin,
    }
}

const mapDispatchToProps = dispatch => ({
    addStudent: (ad, fn, ln, cn, eId, admin) => addStudentAction(ad, fn, ln, cn, eId, admin, dispatch),
    deleteStudent: (ad, eId, admin) => deleteStudentAction(ad, eId, admin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentList)
