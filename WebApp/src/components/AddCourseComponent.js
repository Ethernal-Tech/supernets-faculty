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
        venue: '',
        points: ''
    }

    onSubmit = async event => {
        event.preventDefault()
        if (this.state.title && this.state.description && this.state.startTime && this.state.venue && this.state.points && !isNaN(this.state.points)) {
            this.setState({ isWorking: true })
            const startTimeMs = new Date(this.state.startTime).getTime()
            this.props.onSubmit && await this.props.onSubmit(this.state.title, this.state.description, startTimeMs, this.state.venue, this.state.points)
            this.setState({ title: '', description: '', startTime: '', venue: '', points: '', isWorking: false })
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
                            <Form.Control id="startTime" type="datetime-local" value={this.state.startTime} onChange={this.onChange}/>
                        </Col>
                        <Col>
                            <Form.Control id="venue" type="text" placeholder="Enter course venue" value={this.state.venue} onChange={this.onChange}/>
                        </Col>
                        <Col>
                            <Form.Control id="points" type="text" placeholder="Enter course points" value={this.state.points} onChange={this.onChange}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
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