import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'
import { gradeToContract } from '../../utils/userUtils'

function GradeStudentRow({object, func}) {

    return (
        <Row key={`stud_${object.id}`} >
            <Col>
                <Link to={`/student?stud=${object.id}`}>{object.firstName} {object.lastName}</Link>
            </Col>
            <Col>{object.id}</Col>
            <Col xs={'auto'}>
                <select name="grade" id={object.id} onChange={e => func(e)}>
                    {gradeToContract.map((grade, key) => 
                    {
                        return <option key={key} value={grade.contractGrade}>{grade.grade}</option>
                    })}
                </select>
            </Col>
        </Row>
    );
  }

  export default GradeStudentRow;