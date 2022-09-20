import { useParams } from 'react-router-dom';
import { Input } from 'components/Form'
import VerticalSeparator from 'components/Layout/Separator/VerticalSeparator'
import { SmartFormGroup } from 'components/SmartContainer/SmartContainer'
import { ContentShell } from 'features/Content'
import { useSelector } from 'react-redux'
import { emptyArray } from 'utils/commonHelper'
import { CourseList } from 'containers/Student/CourseList'
import { getUserRole } from 'utils/userUtils'

export const StudentDetailsPage = ({ event }) => {
	const state = useSelector((state: any) => state)
	const params: any = useParams();
	const studentId = params.studentId;

    const userRole = getUserRole(state)
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
                <CourseList student={student} userRole={userRole} event={event} />
            </ContentShell>
		</>
    )
}
