import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'

function StudentCourseRow({object, func}) {

    return (
        //TODO: link to course
        <Row
            key={`course_${object.id}`}>
            <Col>{object.title}</Col>
            <Col>{object.professorName}</Col>
            <Col xs={'auto'}>{func(object.id)}</Col>
        </Row>
    );
  }

  export default StudentCourseRow;