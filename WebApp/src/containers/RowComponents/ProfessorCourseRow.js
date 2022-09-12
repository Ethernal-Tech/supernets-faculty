import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import LoadingSpinner from '../../components/LoadingSpinner'

function ProfessorCourseRow({object, func, isAdmin}) {
    const [isWorking, setIsWorking] = useState(false);

    const onDeleteClick = async () => {
        setIsWorking(true)
        await func(object.id)
        setIsWorking(false)
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>Course with enrolled students cannot be deleted.</Tooltip>
    );

    return (
        <Row key={`course_${object.id}`}>
            <Col><Link style={isWorking ? {pointerEvents: "none"} : null} to={`/course?courseId=${object.id}`}>{object.title}</Link></Col>
            <Col>{object.students.length}</Col>         
            {
                isAdmin &&
                <Col> 
                    {
                        isWorking ?
                        <Button className="btn btn-secondary" type="submit" disabled><LoadingSpinner/></Button> :
                        <>
                            {
                                object.students.length === 0 ?
                                <Button variant="danger" onClick={onDeleteClick}>Delete</Button> :
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip}
                                >
                                    <Button variant="btn btn-secondary">Delete</Button>
                                </OverlayTrigger>
                            }
                        </>
                    }
                </Col>
            }
        </Row>
    );
  }

  export default ProfessorCourseRow;