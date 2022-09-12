import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'

function CourseStudentRow({object, func, func1}) {

    const grade = func(object.id)

    return (
        <Row key={`stud_${object.id}`}>
            <Col xs={'auto'}>
                <div title={(grade !== "---") ? "Student with grade cannot be disenrolled" : ""}>
                    <input
                        type="checkbox"
                        checked={object.selected}
                        className="form-check-input"
                        id={object.id}
                        onChange={(e) => func1(e, object)}
                        disabled={grade !== "---"}
                    />
                </div>
            </Col>
            <Col>
                <Link to={`/student?stud=${object.id}`}>{object.firstName} {object.lastName}</Link>
            </Col>
            <Col>{object.id}</Col>
            <Col>{grade}</Col>
        </Row>
    );
  }

  export default CourseStudentRow;