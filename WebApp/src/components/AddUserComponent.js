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
        name: '',
        addr: '',
    }

    onSubmit = async evt => {
        evt.preventDefault()
        if (this.state.name && this.state.addr) {
            this.setState({ isWorking: true })
            this.props.onSubmit && await this.props.onSubmit(this.state.name, this.state.addr)
            this.setState({ name: '', addr: '', isWorking: false })
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
                            <Form.Control id="name" type="text" placeholder="Enter name" value={this.state.name} onChange={this.onChange} />
                        </Col>
                        <Col>
                            <Form.Control id="addr" type="text" placeholder="Enter address" value={this.state.addr} onChange={this.onChange} />
                        </Col>
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