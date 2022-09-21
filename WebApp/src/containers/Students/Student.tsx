import { useParams } from 'react-router-dom';
import { Input } from 'components/Form'
import VerticalSeparator from 'components/Layout/Separator/VerticalSeparator'
import { SmartFormGroup } from 'components/SmartContainer/SmartContainer'
import { ContentShell } from 'features/Content'
import { useSelector } from 'react-redux'
import { emptyArray } from 'utils/commonHelper'
import { StudentCourses } from 'containers/StudentCourses/StudentCourses'

export const Student = ({ event }) => {
	const state = useSelector((state: any) => state)
	const params: any = useParams();
	const studentId = params.studentId;

    const students = state.users.students || emptyArray
    const student = students.find(stud => stud.id === studentId)

    if (!student) {
        return <></>
    }

    return (
		<>
			<VerticalSeparator margin='medium' />
            <ContentShell title='Student'>
				<div style={{ width: '600px' }}>
					<SmartFormGroup label='Name'>
						<Input
							value={`${student.firstName} ${student.lastName}`}
						/>
					</SmartFormGroup>
                    <SmartFormGroup label='Address'>
						<Input
							value={`${student.id}`}
						/>
					</SmartFormGroup>
					<SmartFormGroup label='Country'>
						<Input
							value={student.country}
						/>
					</SmartFormGroup>
				</div>
				<VerticalSeparator margin='xlarge' />
				<h3>Courses</h3>
                <StudentCourses student={student} event={event} />
            </ContentShell>
		</>
    )
}
