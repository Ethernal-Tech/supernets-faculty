import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'
import { listStyles } from '../../styles'
import Button from 'react-bootstrap/esm/Button'
import LoadingSpinner from '../LoadingSpinner'

function StudentRow({ object, func }) {

    const [isWorking, setIsWorking] = useState(false)

    const onDelete = async() => {
        setIsWorking(true)
        await func(object.id)
        setIsWorking(false)
    }

    return (
        <Row key={`user_${object.id}`}
        style={{ ...listStyles.row, ...listStyles.borderBottomThin }}>
            <Col><Link to={`/student?stud=${object.id}`} style={{pointerEvents: isWorking ? "none" : ""}}>{object.firstName} {object.lastName}</Link></Col>
            <Col>{object.id}</Col>
            <Col xs={"auto"}><Link className="btn btn-primary" to={`/editStudent?stud=${object.id}`}>Edit</Link></Col>
            {
                isWorking ?
                <Col xs={"auto"}><Button className="btn btn-danger"><LoadingSpinner/></Button></Col> :
                <Col xs={"auto"}><Button className="btn btn-danger" onClick={onDelete}>Delete</Button></Col>
            }
        </Row>    
    );
}

export default StudentRow;