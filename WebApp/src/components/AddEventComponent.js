import React from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LoadingSpinner from './LoadingSpinner'
import EventListenerService from "../utils/eventListenerService"
import { generalStyles } from '../styles'

class AddEventComponent extends React.Component {
    constructor(props) {
        super(props)
        this.dateNow = new Date().toISOString().split("T")[0]
        this.onChange = this.onChange.bind(this)
    }

    state = {
        isWorking: false,
        title: '',
        location: '',
        venue: '',
        description: '',
        time: '',
    }

    onSubmit = async event => {
        event.preventDefault()
        if (this.state.title && this.state.location && this.state.venue && this.state.description && this.state.time) {
            this.setState({ isWorking: true })
            const timeMs = new Date(this.state.time).getTime()
            this.props.onSubmit && await this.props.onSubmit(this.state.title, this.state.location, this.state.venue, timeMs, this.state.description)
            this.setState({ title: '', location: '', venue: '', description: '', time: '', isWorking: false })
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
                            <Form.Control id="title" type="text" placeholder="Enter event name" value={this.state.title} onChange={this.onChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Control id="location" type="text" placeholder="Enter event location" value={this.state.location} onChange={this.onChange}/>
                        </Col>
                        <Col>
                            <Form.Control id="venue" type="text" placeholder="Enter event venue" value={this.state.venue} onChange={this.onChange}/>
                        </Col>
                        <Col>
                            <Form.Control id="time" type="date" min={this.dateNow} value={this.state.time} onChange={this.onChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Control id="description" type="text" placeholder="Enter event description" value={this.state.description} onChange={this.onChange}/>
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

export default AddEventComponent