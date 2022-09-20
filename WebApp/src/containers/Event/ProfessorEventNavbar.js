import { Link, useRouteMatch } from 'react-router-dom'

export const ProfessorEventNavbar = () => {
	const { url } = useRouteMatch()

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white" style={{ padding: '0.5rem' }}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to={`${url}/eventDetails`} className="nav-link">Event Details</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={`${url}/profCourses`} className="nav-link">My Courses</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
