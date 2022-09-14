import React from 'react'
import { connect } from 'react-redux'
import { ProfessorCourses } from 'containers/Professor/ProfessorCourses'
import { USER_ROLES } from '../utils/constants'
import { getUserRole } from '../utils/userUtils'
import withRouter from '../utils/withRouter'
import { ContentShell } from 'features/Content'
import { Input } from 'components/Form'
import { SmartFormGroup } from 'components/SmartContainer/SmartContainer'
import VerticalSeparator from 'components/Layout/Separator/VerticalSeparator'
import { emptyArray } from 'utils/commonHelper'

class ProfessorDetailsPage extends React.Component {
    render() {
        const { professor, userRole, selectedAccount } = this.props

        if (!professor) {
            return null
        }

        return (
			<>
				<VerticalSeparator margin='medium' />
	            <ContentShell title='Professor'>
					<div style={{ width: '600px' }}>
						<SmartFormGroup label='Name'>
							<Input
								value={`${professor.firstName} ${professor.lastName}`}
								disabled
							/>
						</SmartFormGroup>
						<SmartFormGroup label='Address'>
							<Input
								value={`${professor.id}`}
								disabled
							/>
						</SmartFormGroup>
						<SmartFormGroup label='Country'>
							<Input
								value={professor.country}
								disabled
							/>
						</SmartFormGroup>
						<SmartFormGroup label='Expertise'>
							<Input
								value={professor.expertise}
								disabled
							/>
						</SmartFormGroup>
					</div>
					<VerticalSeparator margin='xlarge' />
	                <ProfessorCourses professor={professor} userRole={userRole} selectedAccount={selectedAccount}/>
	            </ContentShell>
			</>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const userRole = getUserRole(state)
    const professors = state.users.professors || emptyArray
    let professor
    if (ownProps.prof) {
        professor = professors.find(prof => prof.id === ownProps.prof)
    }
    else if (userRole === USER_ROLES.PROFESSOR) {
        professor = professors.find(x => x.id === state.eth.selectedAccount)
    }

    return {
        userRole,
        professor,
        selectedAccount: state.eth.selectedAccount,
    }
}

export default withRouter(connect(mapStateToProps)(ProfessorDetailsPage))
