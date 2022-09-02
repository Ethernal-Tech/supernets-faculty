import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { listStyles } from '../styles'
import { contractToGrade }  from '../utils/userUtils'
import Pagination from '../components/Pagination'
import CourseStudentRow from '../components/RowComponents/CourseStudentRow'

function CourseStudents(props) {

    const [query, setQuery] = useState('');
    const [students, setStudents] = useState([]);
    const [searchedStudents, setSearchedStudents] = useState([]);

    useEffect(() => {
        let tempList = props.courseStudents
        setStudents(tempList)
        setSearchedStudents(search(tempList, query))
    }, [props.courseStudents])

    const getStudentGrade = (studentId) => {
        return contractToGrade.get(props.gradesByStudent.find(x => x.studentId === studentId).grade)
    }

    const onQueryChange = ({target}) => {
        let newStudents = search(students, target.value)

        setQuery(target.value)
        setSearchedStudents(newStudents)
    }

    const keys = ["firstName", "lastName", "id"]
    const search = (data, query) => {
        let multiFilter
        if (query !== '') {
            multiFilter = []
            let multiQuery = query.split(' ')
            multiQuery.forEach(mq => { if (mq === '') return
                multiFilter.push(data.filter(item => keys.some(key => item[key].toLowerCase().includes(mq.toLowerCase()))))
            })

            return multiFilter.reduce((p, c) => p.filter(e => c.includes(e)))
        }
    
        return data
        // return data.filter(item => keys.some(key => item[key].toLowerCase().includes(query)))
    }

    const { course } = props
    return (
        <div style={{ padding: '1rem' }}>
            <h4>{course.name}</h4>
            <input type="text"
                id="query"
                placeholder='Search...'
                className="search"
                onChange={onQueryChange}/>

            <Container>
                <Row style={listStyles.borderBottom}>
                    <Col>Student name</Col>
                    <Col>Student address</Col>
                    <Col xs={'auto'}>Grade</Col>
                </Row>
                <Pagination 
                    data={searchedStudents}
                    RenderComponent={CourseStudentRow}
                    func={getStudentGrade}
                    pageLimit={5}
                    dataLimit={5}
                />
            </Container>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    const allStudents = (state.users.students || [])
    const courseStudents = ownProps.course.students.map(courseStud => allStudents.find(stud => stud.id === courseStud))
    const gradesByStudent = (state.courses.gradesByStudentByCourse || {})[ownProps.course.id] || {}

    return {
        courseStudents: courseStudents,
        gradesByStudent,
    }
}


export default connect(mapStateToProps)(CourseStudents)