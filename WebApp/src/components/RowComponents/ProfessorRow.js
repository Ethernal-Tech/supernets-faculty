import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'
import { listStyles } from '../../styles'

function ProfessorRow({ object }) {
    return (
        <Row key={`user_${object.id}`}
        style={{ ...listStyles.row, ...listStyles.borderBottomThin }}>
            <Col><Link to={`/professor?prof=${object.id}`}>{object.firstName} {object.lastName}</Link></Col>
            <Col>{object.id}</Col>
            <Col><Link className="btn btn-primary" to={`/editProfessor?prof=${object.id}`}>Edit</Link></Col>
        </Row>    
    );
}

export default ProfessorRow;