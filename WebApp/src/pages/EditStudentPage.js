import React from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import EventListenerService from "../utils/eventListenerService"
import { generalStyles } from '../styles'
import { connect } from 'react-redux'
import { editStudentAction } from '../actions/userActions'

class EditStudentPage extends React.Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
    }

    state = {
        isWorking: false,
        firstName: '',
        addr: '',
    }

    componentDidMount() {
        this.setState({ firstName: this.props.selectedUser.firstName })
        this.setState({ addr: this.props.selectedUser.id })
    }

    onSubmit = async evt => {
        evt.preventDefault()
        if (this.state.firstName && this.state.addr) {
            this.setState({ isWorking: true })
            await this.props.editStudent(this.state.addr, this.state.firstName, this.props.selectedEvent.eventId, this.props.selectedAccount)
            this.setState({ firstName: '', addr: '', isWorking: false })
        } else {
            EventListenerService.notify("error", 'fields not populated!')
        }
    }

    onChange = ({target}) => {
        this.setState({ [target.id]: target.value })
    }

    render() {
        return (
            <Container style={{ paddingTop: 20 }}>
                <Form onSubmit={this.onSubmit}>
                    <Row>
                        <Col>
                            <Form.Control id="firstName" type="text" placeholder="Enter first name" value={this.state.firstName} onChange={this.onChange} />
                        </Col>
                        <Col>
                            <Form.Control id="addr" type="text" placeholder="Enter address" value={this.state.addr} onChange={this.onChange} disabled="true" />
                        </Col>
                        <Col xs={'auto'}>
                        {
                            this.state.isWorking ?
                            <Button variant="primary" type="submit" style={generalStyles.button} disabled><LoadingSpinner /></Button>
                            :
                            <Button variant="primary" type="submit" style={generalStyles.button}>Edit</Button>
                        }
                        </Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedUser: state.users.selectedUser,
        selectedEvent: state.event.selectedEvent,
        selectedAccount: state.eth.selectedAccount
    }
}

const mapDispatchToProps = dispatch => ({
    editStudent: (studentAddr, firstName, eventId, selectedAccount) => editStudentAction(studentAddr, firstName, eventId, selectedAccount, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditStudentPage)