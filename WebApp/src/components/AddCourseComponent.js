import React from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LoadingSpinner from './LoadingSpinner'
import EventListenerService from "../utils/eventListenerService"
import { generalStyles } from '../styles'

class AddCourseComponent extends React.Component {

    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
    }

    state = {
        isWorking: false,
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        venue: ''
    }

    onSubmit = async event => {
        event.preventDefault()
        if (this.state.title && this.state.description && this.state.startTime && this.state.endTime && this.state.venue) {
            this.setState({ isWorking: true })
            const startTimeMs = new Date(this.state.startTime).getTime()
            const endTimeMs = new Date(this.state.endTime).getTime()
            this.props.onSubmit && await this.props.onSubmit(this.state.title, this.state.description, startTimeMs, endTimeMs, this.state.venue)
            this.setState({ title: '', description: '', startTime: '', endTime: '', venue: '', isWorking: false })
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
                            <Form.Control id="title" type="text" placeholder="Enter course name" value={this.state.title} onChange={this.onChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Control id="startTime" type="datetime-local"  onChange={this.onChange}/>
                        </Col>                     
                        <Col>
                            <Form.Control id="endTime" type="datetime-local"  onChange={this.onChange}/>
                        </Col>
                        <Col>
                            <Form.Control id="venue" type="text" placeholder="Enter course venue" value={this.state.venue} onChange={this.onChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Control id="description" type="text" placeholder="Enter course description" value={this.state.description} onChange={this.onChange}/>
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

export default AddCourseComponent