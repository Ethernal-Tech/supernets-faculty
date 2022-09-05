import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
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

function EditStudentPage(props) {

    const [isWorking, setIsWorking] = useState(false);
    const [addr, setAddr] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [country, setCountry] = useState('');

    let navigate = useNavigate()

    useEffect(() => {
        setAddr(props.student.id)
        setFirstName(props.student.firstName)
        setLastName(props.student.lastName)
        setCountry(props.student.country)
    }, [])

    const onSubmit = async evt => {
        evt.preventDefault()
        if (addr && firstName && lastName && country) {
            setIsWorking(true)
            await props.editStudent(addr, firstName, lastName, country, props.selectedEvent.eventId, props.selectedAccount)
            navigate('/event?tab=students')
        } else {
            EventListenerService.notify("error", 'fields not populated!')
        }
    }

    return (
        <Container style={{ paddingTop: 20 }}>
            <Form onSubmit={onSubmit}>
                <Row>
                    <Col>
                        <Form.Control id="addr" type="text" value={addr} onChange={e => setAddr(e.target.value)} disabled={true} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Control id="firstName" type="text" placeholder="Enter first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </Col>
                    <Col>
                        <Form.Control id="lastName" type="text" placeholder="Enter last name" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Control id="country" type="text" placeholder="Enter country" value={country} onChange={e => setCountry(e.target.value)} />
                    </Col>
                    <Col>
                        {/* <Form.Control id="addr" type="text" placeholder="Enter expertise" value={expertise} onChange={e => setExpertise(e.target.value} /> */}
                    </Col>
                </Row>
                <Row>
                    <Col xs={'auto'}>
                    {
                        isWorking ?
                        <Button variant="primary" type="submit" style={generalStyles.button} disabled><LoadingSpinner /></Button> :
                        <Button variant="primary" type="submit" style={generalStyles.button}>Edit</Button>
                    }
                    </Col>
                </Row>
            </Form>
        </Container>
    )
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