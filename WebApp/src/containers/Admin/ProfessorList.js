import React from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { USER_ROLES } from '../../utils/constants'
import AddUserComponent from '../../components/AddUserComponent'
import { addProfessorAction } from '../../actions/userActions'

class ProfessorList extends React.Component {
    onSubmit = async (name, addr) => this.props.addProfessor(name, addr, this.props.selectedAccount)

    render() {
        const { professors, userRole } = this.props
        return (
            <div style={{ padding: '1rem' }}>
                <h4>Professors</h4>
                
                <Container>
                    <Row style={styles.borderBottom}>
                        <Col>Name</Col>
                        <Col>Address</Col>
                    </Row>
                    {
                        professors.map((professor, ind) => (
                            <Row
                                key={`prof_${ind}`}
                                style={ind === professors.length - 1 ? styles.paddingVertical : { ...styles.paddingVertical, ...styles.borderBottomThin }}>
                                <Col>{professor.name}</Col>
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

const styles = {
    borderBottomThin: {
        borderBottom: '1px solid black'
    },
    borderBottom: {
        borderBottom: '2px solid black'
    },
    paddingVertical: {
        paddingTop: 5,
        paddingBottom: 5,
    }
}