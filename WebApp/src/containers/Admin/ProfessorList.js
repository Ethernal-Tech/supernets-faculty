import React from 'react'
import '../../listStyles.css'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { USER_ROLES } from '../../utils/constants'
import AddUserComponent from '../../components/AddUserComponent'
import { addProfessorAction } from '../../actions/userActions'
import { listStyles } from '../../styles'

class ProfessorList extends React.Component {
    onSubmit = async (name, addr) => this.props.addProfessor(name, addr, this.props.selectedAccount)

    render() {
        const { professors, userRole } = this.props
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
                                <Col><Link to={`/professor?prof=${ind}`}>{professor.name}</Link></Col>
                                <Col>{professor.id}</Col>
                            </Row>                           
                        ))
                    }
                </Container>
                {
                    userRole === USER_ROLES.ADMIN &&
                    <AddUserComponent onSubmit={this.onSubmit} />
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    professors: state.users.professors || [],
    selectedAccount: state.eth.selectedAccount,
})

const mapDispatchToProps = dispatch => ({
    addProfessor: (name, addr, selectedAccount) => addProfessorAction(name, addr, selectedAccount, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorList)