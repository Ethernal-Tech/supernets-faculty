import React from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LoadingSpinner from './LoadingSpinner'
import EventListenerService from "../utils/eventListenerService"
import { generalStyles } from '../styles'

class AddUserComponent extends React.Component {
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

    onSubmit = async evt => {
        evt.preventDefault()
        if (this.state.addr && this.state.firstName && this.state.lastName && this.state.country && this.state.expertise) {
            this.setState({ isWorking: true })
            this.props.onSubmit && await this.props.onSubmit(this.state.addr, this.state.firstName, this.state.lastName, this.state.country, this.state.expertise)
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
                            <Form.Control id="addr" type="text" placeholder="Enter address" value={this.state.addr} onChange={this.onChange} />
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
                            <Button variant="primary" type="submit" style={generalStyles.button}>Add</Button>
                        }
                        </Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

export default AddUserComponent