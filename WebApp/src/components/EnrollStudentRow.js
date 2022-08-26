import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'

function EnrollStudentRow({student, onItemCheck}) {

    return (
        <Row key={`stud_${student.id}`} >
            <Col>
                <input
                    type="checkbox"
                    checked={student.selected}
                    className="form-check-input"
                    id={student.id}
                    onChange={(e) => onItemCheck(e, student)}
                />
            </Col>
            <Col>
                <Link to={`/student?stud=${student.id}`}>{student.firstName} {student.lastName}</Link>
            </Col>
            <Col>{student.id}</Col>
        </Row>
    );
  }

  export default EnrollStudentRow;