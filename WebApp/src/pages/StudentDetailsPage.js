import { Input } from 'components/Form'
import VerticalSeparator from 'components/Layout/Separator/VerticalSeparator'
import { SmartFormGroup } from 'components/SmartContainer/SmartContainer'
import { ContentShell } from 'features/Content'
import React from 'react'
import { connect } from 'react-redux'
import { emptyArray } from 'utils/commonHelper'
import CourseList from '../containers/Student/CourseList'
import { USER_ROLES } from '../utils/constants'
import { getUserRole } from '../utils/userUtils'
import withRouter from '../utils/withRouter'

class StudentDetailsPage extends React.Component {
    render() {
        const { student, stud, userRole } = this.props
        if (!student) {
            return null
        }

        return (
			<>
				<VerticalSeparator margin='medium' />
	            <ContentShell title='Student'>
					<div style={{ width: '600px' }}>
						<SmartFormGroup label='Name'>
							<Input
								value={`${student.firstName} ${student.lastName}`}
								disabled
							/>
						</SmartFormGroup>
                        <SmartFormGroup label='Address'>
							<Input
								value={`${student.id}`}
								disabled
							/>
						</SmartFormGroup>
						<SmartFormGroup label='Country'>
							<Input
								value={student.country}
								disabled
							/>
						</SmartFormGroup>
					</div>
					<VerticalSeparator margin='xlarge' />
	                <CourseList student={student} userRole={userRole} studParam={stud}/>
	            </ContentShell>
			</>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const userRole = getUserRole(state)
    const students = state.users.students || emptyArray
    let student
    if (ownProps.stud) {
        student = students.find(stud => stud.id === ownProps.stud)
    }
    else if (userRole === USER_ROLES.STUDENT) {
        student = students.find(stud => stud.id === state.eth.selectedAccount)
    }

    return {
        userRole,
        student,
    }
}

export default withRouter(connect(mapStateToProps)(StudentDetailsPage))
