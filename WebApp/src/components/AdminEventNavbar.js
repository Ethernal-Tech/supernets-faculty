import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import withRouter from '../utils/withRouter';

function AdminEventNavbar(props) {

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
                            <Link to={'professors'} className="nav-link">Professors</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'courses'} className="nav-link">Courses</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'students'} className="nav-link">Students</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'admins'} className="nav-link">Event Admins</Link>
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

export default withRouter(connect(mapStateToProps)(AdminEventNavbar))