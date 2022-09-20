import { Link, useRouteMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const StudentEventNavbar = () => {
	const { url } = useRouteMatch()
	const { eth } = useSelector((state: any) => state)

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-white" style={{ padding: '0.5rem' }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to={`${url}/eventDetails`} className="nav-link">Event Details</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={`/student?stud=${eth.selectedAccount}`} className="nav-link">My Courses</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}
