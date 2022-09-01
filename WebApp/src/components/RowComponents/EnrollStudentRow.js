import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'

function EnrollStudentRow({object, func}) {

    return (
        <Row key={`stud_${object.id}`} >
            <Col xs={'auto'}>
                <input
                    type="checkbox"
                    checked={object.selected}
                    className="form-check-input"
                    id={object.id}
                    onChange={(e) => func(e, object)}
                />
            </Col>
            <Col>
                <Link to={`/student?stud=${object.id}`}>{object.firstName} {object.lastName}</Link>
            </Col>
            <Col>{object.id}</Col>
        </Row>
    );
  }

  export default EnrollStudentRow;