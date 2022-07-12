import React from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

class AddUserComponent extends React.Component {
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
        }
    }

    onNameChange = evt => this.setState({ name: evt.target.value })

    onAddrChange = evt => this.setState({ addr: evt.target.value })

    render() {
        return (
            <Container style={{ paddingTop: 20 }}>
                <Form onSubmit={this.onSubmit}>
                    <Row>
                        <Col>
                            <Form.Control id="name" type="text" placeholder="Enter name" value={this.state.name} onChange={this.onNameChange} />
                        </Col>
                        <Col>
                            <Form.Control id="address" type="text" placeholder="Enter address" value={this.state.addr} onChange={this.onAddrChange} />
                        </Col>
                        <Col xs={'auto'}>
                        <Button variant="primary" type="submit" disabled={this.state.isWorking}>
                            Add
                        </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

export default AddUserComponent