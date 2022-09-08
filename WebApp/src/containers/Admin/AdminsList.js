import React from 'react'
import { connect } from 'react-redux'
import { addAdminAction, deleteAdminAction } from '../../actions/userActions'
import { isEventAdmin } from '../../utils/userUtils'
import AddAdminComponent from '../../components/AddAdminComponent'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { listStyles } from '../../styles'
import Button from 'react-bootstrap/esm/Button'

function AdminsList(props) {

    const onSubmit = async (addr) => props.addAdmin(props.selectedEvent.id, addr, props.selectedAccount)

    const onDelete = (adminId) => {
        props.deleteAdmin(props.selectedEvent.id, adminId, props.selectedAccount)
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h4>Event Admins</h4>
            
            <Container>
                <Row style={listStyles.borderBottom}>
                    <Col>Address</Col>
                    <Col xs={"auto"}> </Col>
                </Row>
                {
                    props.admins.map((admin, ind) => (                            
                        <Row key={`prof_${admin}`} 
                            style={ind === props.admins.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                            <Col>{admin}</Col>
                            <Col xs={"auto"}><Button className="btn btn-danger" onClick={() => onDelete(admin)}>Delete</Button></Col>
                        </Row>                           
                    ))
                }
            </Container>
            {
                props.isAdmin &&
                <AddAdminComponent onSubmit={onSubmit} />
            }
        </div>
    )
}

const mapStateToProps = state => {
    const isAdmin = isEventAdmin(state)
    return {
        admins: state.users.admins || [],
        selectedAccount: state.eth.selectedAccount,
        selectedEvent: state.event.selectedEvent,
        isAdmin
    }
}

const mapDispatchToProps = dispatch => ({
    addAdmin: (eventId, addr, selectedAccount) => addAdminAction(eventId, addr, selectedAccount, dispatch),
    deleteAdmin: (eventId, addr, selectedAccount) => deleteAdminAction(eventId, addr, selectedAccount, dispatch)    
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminsList)