import React from 'react'
import '../../listStyles.css'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import AddUserComponent from '../../components/AddUserComponent'
import { addProfessorAction, setSelectedUserAction } from '../../actions/userActions'
import { listStyles } from '../../styles'
import { isUserAdmin } from '../../utils/userUtils'

class ProfessorList extends React.Component {

    onSubmit = async (ad, fn, ln, cn, ex) => this.props.addProfessor(ad, fn, ln, cn, ex, this.props.selectedEvent.eventId, this.props.selectedAccount)

    onEventClick(e, props, professor){
        debugger
        props.setSelectedUser(professor)
    }

    render() {
        const { professors } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>Professors</h4>
                
                <Container>
                    <Row style={listStyles.borderBottom}>
                        <Col>Name</Col>
                        <Col>Address</Col>
                    </Row>
                    {
                        professors.map((professor, ind) => (                            
                            <Row key={`prof_${professor.id}`} 
                                style={ind === professors.length - 1 ? listStyles.row : { ...listStyles.row, ...listStyles.borderBottomThin }}>
                                <Col><Link to={`/professor?prof=${ind}`}>{professor.firstName} {professor.lastName}</Link></Col>
                                <Col>{professor.id}</Col>
                                <Col><Link className="btn btn-primary" to={'/editProfessor'} onClick={e => this.onEventClick(e, this.props, professor)}>Edit</Link></Col>
                            </Row>                           
                        ))
                    }
                </Container>
                {
                    this.props.isAdmin &&
                    <AddUserComponent onSubmit={this.onSubmit} />
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    const isAdmin = isUserAdmin(state)
    return {
        professors: state.users.professors || [],
        selectedAccount: state.eth.selectedAccount,
        selectedEvent: state.event.selectedEvent,
        isAdmin
    }
}

const mapDispatchToProps = dispatch => ({
    addProfessor: (ad, fn, ln, cn, ex, eId, admin) => addProfessorAction(ad, fn, ln, cn, ex, eId, admin, dispatch),
    setSelectedUser: (user) => setSelectedUserAction(user, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorList)