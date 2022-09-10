import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'

function ProfessorCourseRow({object}) {

    return (
        <Row key={`course_${object.id}`}>
            <Col><Link to={`/course?courseId=${object.id}`}>{object.title}</Link></Col>
            <Col xs={'auto'}>{object.students.length}</Col>
        </Row>
    );
  }

  export default ProfessorCourseRow;