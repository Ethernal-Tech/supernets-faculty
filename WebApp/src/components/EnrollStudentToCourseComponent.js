import React from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LoadingSpinner from './LoadingSpinner'
import EventListenerService from "../utils/eventListenerService"
import { generalStyles } from '../styles'

class EnrollStudentToCourseComponent extends React.Component {
    state = {
        isWorking: false,
        studentAddr: '',
    }

    onSubmit = async evt => {
        evt.preventDefault()
        if (this.state.studentAddr) {
            this.setState({ isWorking: true })
            this.props.onSubmit && await this.props.onSubmit(this.state.studentAddr)
            this.setState({ studentAddr: '', isWorking: false })
        } else {
            EventListenerService.notify("error", 'fields not populated!')
        }
    }

    onStudentChange = evt => this.setState({ studentAddr: evt.target.value })

    render() {
        const { studentsToEnroll } = this.props
        return (
            <Container style={{ paddingTop: 20 }}>
                <Form onSubmit={this.onSubmit}>
                    <Row>
                        <Col>
                            <Form.Select onChange={this.onStudentChange} value={this.state.studentAddr}>
                                <option value={''}>Select student to enroll</option>
                                {
                                    studentsToEnroll.map(student => (
                                        <option key={`stud_enroll_${student.id}`} value={student.id}>{student.name}</option>
                                    ))
                                }
                            </Form.Select>
                        </Col>
                        <Col xs={'auto'}>
                        {
                            this.state.isWorking ?
                            <Button variant="primary" type="submit" style={generalStyles.button} disabled><LoadingSpinner /></Button>
                            :
                            <Button variant="primary" type="submit" style={generalStyles.button} disabled={!this.state.studentAddr}>Enroll</Button>
                        }
                        </Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

export default EnrollStudentToCourseComponent