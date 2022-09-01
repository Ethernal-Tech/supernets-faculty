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
import { editProfessorAction } from '../actions/userActions'
import withRouter from '../utils/withRouter'

class EditProfessorPage extends React.Component {
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
        expertise: '',
    }

    componentDidMount() {
        const { professor } = this.props

        this.setState({ addr: professor.id })
        this.setState({ firstName: professor.firstName })
        this.setState({ lastName: professor.lastName })
        this.setState({ country: professor.country })
        this.setState({ expertise: professor.expertise })
    }

    onSubmit = async evt => {
        evt.preventDefault()
        if (this.state.addr && this.state.firstName && this.state.lastName && this.state.country && this.state.expertise) {
            this.setState({ isWorking: true })
            await this.props.editProfessor(this.state.addr, this.state.firstName, this.state.lastName, this.state.country, this.state.expertise, this.props.selectedEvent.eventId, this.props.selectedAccount)
            this.setState({ addr: '', firstName: '', lastName: '', country: '', expertise: '', isWorking: false })
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
                            <Form.Control id="expertise" type="text" placeholder="Enter expertise" value={this.state.expertise} onChange={this.onChange} />
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
    const professors = state.users.professors || []
    const professor = professors.find(prof => prof.id === ownProps.prof)
    
    return {
        professor,
        selectedEvent: state.event.selectedEvent,
        selectedAccount: state.eth.selectedAccount
    }
}

const mapDispatchToProps = dispatch => ({
    editProfessor: (ad, fn, ln, cn, ex, eId, admin) => editProfessorAction(ad, fn, ln, cn, ex, eId, admin, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditProfessorPage))