import { Link, useRouteMatch } from 'react-router-dom'

export const AdminEventNavbar = () => {
	const { url } = useRouteMatch()

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-white" style={{ padding: '0.5rem' }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to={`${url}/eventDetails`} className="nav-link">Event Details</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={`${url}/professors`} className="nav-link">Professors</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={`${url}/courses`} className="nav-link">Courses</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={`${url}/students`} className="nav-link">Students</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={`${url}/admins`} className="nav-link">Event Admins</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}
