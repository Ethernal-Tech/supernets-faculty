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
import withRouter from '../utils/withRouter'

class EditStudentPage extends React.Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
    }

    state = {
        isWorking: false,
        addr: '',
        firstName: '',
        lastName: '',
        country: '',
    }

    componentDidMount() {
        const { student } = this.props

        this.setState({ addr: student.id })
        this.setState({ firstName: student.firstName })
        this.setState({ lastName: student.lastName })
        this.setState({ country: student.country })
    }

    onSubmit = async evt => {
        evt.preventDefault()
        if (this.state.addr && this.state.firstName && this.state.lastName && this.state.country) {
            this.setState({ isWorking: true })
            await this.props.editStudent(this.state.addr, this.state.firstName, this.state.lastName, this.state.country, this.props.selectedEvent.eventId, this.props.selectedAccount)
            this.setState({ addr: '', firstName: '', lastName: '', country: '', isWorking: false })
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
                            <Form.Control id="addr" type="text" value={this.state.addr} onChange={this.onChange} disabled={true} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Control id="firstName" type="text" placeholder="Enter first name" value={this.state.firstName} onChange={this.onChange} />
                        </Col>
                        <Col>
                            <Form.Control id="lastName" type="text" placeholder="Enter last name" value={this.state.lastName} onChange={this.onChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Control id="country" type="text" placeholder="Enter country" value={this.state.country} onChange={this.onChange} />
                        </Col>
                        <Col>
                            {/* <Form.Control id="addr" type="text" placeholder="Enter expertise" value={this.state.expertise} onChange={this.onChange} /> */}
                        </Col>
                    </Row>
                    <Row>
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

const mapStateToProps = (state, ownProps) => {
    const students = state.users.students || []
    const student = students.find(stud => stud.id === ownProps.stud)

    return {
        student,
        selectedEvent: state.event.selectedEvent,
        selectedAccount: state.eth.selectedAccount
    }
}

const mapDispatchToProps = dispatch => ({
    editStudent: (ad, fn, ln, cn, eId, admin) => editStudentAction(ad, fn, ln, cn, eId, admin, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditStudentPage))