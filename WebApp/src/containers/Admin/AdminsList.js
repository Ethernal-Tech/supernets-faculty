import React from 'react'
import { connect } from 'react-redux'
import { addAdminAction } from '../../actions/userActions'
import { isEventAdmin } from '../../utils/userUtils'
import AddAdminComponent from '../../components/AddAdminComponent'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { listStyles } from '../../styles'

class AdminsList extends React.Component {

    onSubmit = async (addr) => this.props.addAdmin(this.props.selectedEvent.eventId, addr, this.props.selectedAccount)

    render() {
        const { admins } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>Event Admins</h4>
                
                <Container>
                    <Row style={listStyles.borderBottom}>
                        <Col>Address</Col>
                    </Row>
                    {
                        admins.map((admin, ind) => (                            
                            <Row key={`prof_${admin}`} 
                                style={ind === admins.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                                <Col>{admin}</Col>
                            </Row>                           
                        ))
                    }
                </Container>
                {
                    this.props.isAdmin &&
                    <AddAdminComponent onSubmit={this.onSubmit} />
                }
            </div>
        )
    }
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
    addAdmin: (eventId, addr, selectedAccount) => addAdminAction(eventId, addr, selectedAccount, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminsList)