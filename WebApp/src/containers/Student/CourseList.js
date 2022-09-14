import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { loadStudentCoursesAction, generateCertificateAction } from 'actions/coursesActions'
import { contractToGrade }  from 'utils/userUtils'
import { createMetadata, uploadMetadata } from 'utils/nftUtils'
import { BaseColumnModel, LocalTable } from 'components/Table';
import { ColumnContainer } from 'components/Layout'
import { Input } from 'components/Form'
import { Button } from 'components/Button'
import { emptyArray, emptyObject } from 'utils/commonHelper'

const keys = ["title"]

const tableColumns: BaseColumnModel[] = [
	{
		field: 'title',
		title: 'Course name',
		visible: true
	},
	{
		field: 'professorName',
		title: "Professor's Name",
		visible: true
	},
	{
		field: 'grade',
		title: "Grade",
		visible: true
	}
]

function CourseList(props) {
    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [searchedCourses, setSearchedCourses] = useState([]);

    useEffect(
		() => {
			if (courses.length === 0) {
				props.loadStudentCourses(props.student.id, props.selectedEvent.id)
			}
		},
		[courses, props.student, props.selectedEvent]
	);

    useEffect(
		() => {
            setCourses(props.studentCourses)
		},
		[props.studentCourses]
	);

    const search = useCallback(
		(data, query) => {
	        return data.filter(item => keys.some(key => item[key].toLowerCase().includes(query.toLowerCase())))
		},
		[]
	)

    useEffect(
		() => {
			const newCourses = search(courses, query)
			const localTableCourses: any[] = [];
			for (const course of newCourses || []) {
				localTableCourses.push({
					title: course.title,
					professorName: course.professorName,
					grade: contractToGrade.get(course.grade.grade),
					id: course.id
				})
			}
	        setSearchedCourses(localTableCourses)
		},
		[query, search, courses]
	)

    const onGenerateCertificate = async evt => {
        const metadata = createMetadata(props.student, props.studentCourses)
        console.log(metadata)
        const ipfsUri = await uploadMetadata(metadata);

        console.log(ipfsUri)
        await props.generateCertificate(props.student.id, props.selectedAccount, ipfsUri, props.selectedEvent.id)
    }

    return (
		<ColumnContainer margin='medium'>
			<Button
				text='Produce certificate'
				onClick={onGenerateCertificate}
			/>
			<h2>Courses</h2>
			<div style={{ width: '200px'}}>
				<Input
					value={query}
					placeholder='Search...'
					onChange={setQuery}
				/>
			</div>
			<LocalTable
				columns={tableColumns}
				data={searchedCourses}
				hasPagination
				limit={5}
			/>
		</ColumnContainer>
    )
}

const mapStateToProps = (state, ownProps) => {
    const allCourses = state.courses.allCourses || emptyArray
    const gradesByCourse = (state.courses.gradesByCourseByStudent || {})[ownProps.student.id] || emptyObject
    const studentCourses = ((state.courses.studentCourses || {})[ownProps.student.id] || emptyArray).map(x => {
        const course = allCourses.find(y => y.id === x)
        const grade = gradesByCourse.find(y => y.courseId === x)
        return {
            ...course,
            grade
        }
    })
    return {
        selectedAccount: state.eth.selectedAccount,
        selectedEvent: state.event.selectedEvent,
        studentCourses: studentCourses,
    }
}

const mapDispatchToProps = dispatch => ({
    loadStudentCourses: (accountAddress, eventId) => loadStudentCoursesAction(accountAddress, eventId, dispatch),
    generateCertificate: (studentAddr, selectedAccount, ipfsURI, eventId) => generateCertificateAction(studentAddr, selectedAccount, ipfsURI, eventId)
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseList)
