import React from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LoadingSpinner from './LoadingSpinner'
import EventListenerService from "../utils/eventListenerService"

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
        startDate: '',
        endDate: '',
    }

    onSubmit = async event => {
        event.preventDefault()
        if (this.state.title && this.state.location && this.state.venue && this.state.description && this.state.startDate && this.state.endDate) {
            this.setState({ isWorking: true })
            const timeStartMs = new Date(this.state.startDate).getTime()
            const timeEndMs = new Date(this.state.endDate).getTime()
            this.props.onSubmit && await this.props.onSubmit(this.state.title, this.state.location, this.state.venue, timeStartMs, timeEndMs, this.state.description)
            this.setState({ title: '', location: '', venue: '', description: '', startDate: '', endDate: '', isWorking: false })
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
                            <Form.Label>Event name</Form.Label>
                            <Form.Control id="title" type="text" value={this.state.title} onChange={this.onChange}/>
                        </Col>
                        <Col>
                            <Form.Label>Location</Form.Label>
                            <Form.Control id="location" type="text" value={this.state.location} onChange={this.onChange}/>
                        </Col>
                        <Col>
                            <Form.Label>Venue</Form.Label>
                            <Form.Control id="venue" type="text" value={this.state.venue} onChange={this.onChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Label>Start date</Form.Label>
                            <Form.Control id="time" type="date" min={this.dateNow} value={this.state.startDate} onChange={this.onChange}/>
                        </Col>
                        <Col>
                            <Form.Label>End date</Form.Label>
                            <Form.Control id="time" type="date" min={this.dateNow} value={this.state.endDate} onChange={this.onChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Label>Description</Form.Label>
                            {/* <Form.Control id="description" type="text" placeholder="Enter event description" value={this.state.description} onChange={this.onChange}/> */}
                            <textarea id="description" type="text" className="form-control" value={this.state.description} onChange={this.onChange}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div className='text-end'>
                                {
                                    this.state.isWorking ?
                                    <Button className="btn btn-secondary" type="submit" disabled><LoadingSpinner/></Button>
                                    :
                                    <Button className="btn btn-secondary" type="submit">Add</Button>
                                }
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

export default AddEventComponent