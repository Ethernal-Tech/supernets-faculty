import React from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LoadingSpinner from './LoadingSpinner'
import EventListenerService from "../utils/eventListenerService"

class AddSubjectComponent extends React.Component {
    state = {
        isWorking: false,
        name: '',
    }

    onSubmit = async evt => {
        evt.preventDefault()
        if (this.state.name) {
            this.setState({ isWorking: true })
            this.props.onSubmit && await this.props.onSubmit(this.state.name)
            this.setState({ name: '', isWorking: false })
        } else {
            EventListenerService.notify("error", 'fields not populated!')
        }
    }

    onNameChange = evt => this.setState({ name: evt.target.value })

    render() {
        const buttonStyle = { width: '140px' }
        return (
            <Container style={{ paddingTop: 20 }}>
                <Form onSubmit={this.onSubmit}>
                    <Row>
                        <Col>
                            <Form.Control id="name" type="text" placeholder="Enter name" value={this.state.name} onChange={this.onNameChange} />
                        </Col>
                        <Col xs={'auto'}>
                        {
                            this.state.isWorking ?
                            <Button variant="primary" type="submit" style={buttonStyle} disabled><LoadingSpinner /></Button>
                            :
                            <Button variant="primary" type="submit" style={buttonStyle}>Add</Button>
                        }
                        </Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

export default AddSubjectComponent