import React, { useEffect, useState } from 'react'
import '../../listStyles.css'
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import AddUserComponent from '../../components/AddUserComponent'
import Pagination from '../../components/Pagination'
import ProfessorRow from '../RowComponents/ProfessorRow'
import { addProfessorAction, deleteProfessorAction } from '../../actions/userActions'
import { listStyles } from '../../styles'
import { isEventAdmin } from '../../utils/userUtils'

function ProfessorList(props) {

    const [query, setQuery] = useState('');
    const [allProfessors, setAllProfessors] = useState([]);
    const [searchedProfessors, setSearchedProfessors] = useState([]);

    useEffect(() => {
        let tempList = props.professors
        setAllProfessors(tempList)
        setSearchedProfessors(search(tempList, query))
    }, [props.professors])

    const onSubmit = async (ad, fn, ln, cn, ex) => props.addProfessor(ad, fn, ln, cn, ex, props.selectedEvent.id, props.selectedAccount)

    const onQueryChange = ({target}) => {
        let newProfessors = search(allProfessors, target.value)

        setQuery(target.value)
        setSearchedProfessors(newProfessors)
    }

    const onDelete = async(profId) => {
        await props.deleteProfessor(profId, props.selectedEvent.id, props.selectedAccount)
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
            <h4>Professors</h4>

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
                    data={searchedProfessors}
                    RenderComponent={ProfessorRow}
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
        professors: state.users.professors || [],
        selectedAccount: state.eth.selectedAccount,
        selectedEvent: state.event.selectedEvent,
        isAdmin
    }
}

const mapDispatchToProps = dispatch => ({
    addProfessor: (ad, fn, ln, cn, ex, eId, admin) => addProfessorAction(ad, fn, ln, cn, ex, eId, admin, dispatch),
    deleteProfessor: (ad, eId, admin) => deleteProfessorAction(ad, eId, admin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorList)
