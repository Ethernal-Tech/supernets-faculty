import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import withRouter from '../utils/withRouter';

function ProfessorEventNavbar(props) {

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-white" style={{ padding: '0.5rem' }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <div className="navbar-brand">
                        {props.selectedEvent.title}
                    </div>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to={'eventDetails'} className="nav-link">Event Details</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'profCourses'} className="nav-link">My Courses</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

const mapStateToProps = state => {
    return {
        selectedAccount: state.eth.selectedAccount,
        selectedEvent: state.event.selectedEvent,
    }
}

export default withRouter(connect(mapStateToProps)(ProfessorEventNavbar))