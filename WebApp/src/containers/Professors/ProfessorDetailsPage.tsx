import { useSelector } from 'react-redux'
import { ProfessorCourses } from 'containers/Professor/ProfessorCourses'
import { ContentShell } from 'features/Content'
import { Input } from 'components/Form'
import { SmartFormGroup } from 'components/SmartContainer/SmartContainer'
import VerticalSeparator from 'components/Layout/Separator/VerticalSeparator'
import { emptyArray } from 'utils/commonHelper'
import { useParams } from 'react-router-dom';

export const ProfessorDetailsPage = ({ event }) => {
	const state = useSelector((state: any) => state)
	const params: any = useParams()
	const professorId = params.professorId

    const professors = state.users.professors || emptyArray
    let professor = professors.find(prof => prof.id === professorId)

    if (!professor) {
        return <></>
    }

    return (
		<>
			<VerticalSeparator margin='medium' />
            <ContentShell title='Professor'>
				<div style={{ width: '600px' }}>
					<SmartFormGroup label='Name'>
						<Input
							value={`${professor.firstName} ${professor.lastName}`}
						/>
					</SmartFormGroup>
					<SmartFormGroup label='Address'>
						<Input
							value={`${professor.id}`}
						/>
					</SmartFormGroup>
					<SmartFormGroup label='Country'>
						<Input
							value={professor.country}
						/>
					</SmartFormGroup>
					<SmartFormGroup label='Expertise'>
						<Input
							value={professor.expertise}
						/>
					</SmartFormGroup>
				</div>
				<VerticalSeparator margin='xlarge' />
                <ProfessorCourses professor={professor} event={event} />
            </ContentShell>
		</>
    )
}
