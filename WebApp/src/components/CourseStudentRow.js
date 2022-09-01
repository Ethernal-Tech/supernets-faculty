import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'
import { gradeToContract } from '../utils/userUtils'

function CourseStudentRow({object, func}) {

    return (
        <Row key={`stud_${object.id}`}>
            <Col>
                <Link to={`/student?stud=${object.id}`}>{object.firstName} {object.lastName}</Link>
            </Col>
            <Col>{object.id}</Col>
            <Col xs={'auto'}>
                {
                    func(object.id)
                }
            </Col>
        </Row>
    );
  }

  export default CourseStudentRow;