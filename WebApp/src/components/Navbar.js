import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Alert from 'react-bootstrap/Alert';
import EventListenerService from "../utils/eventListenerService"
import { USER_ROLES } from '../utils/constants'
import { getUserRole } from '../utils/userUtils'

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { counter: 0, errors: [] }
    }

    componentDidMount() {
        this.listener = EventListenerService.subscribe("error", error => {
            const msg = error.message || error
            const newErrors = [...this.state.errors, msg]            
            !this.isUnmounted && this.setState({...this.state, errors: newErrors })
        })
    }

    componentWillUnmount() {
        this.isUnmounted = true
        this.listener.remove()
    }

    removeError(idx) {
        const errors = this.state.errors.filter((_, i) => i !== idx)
        this.setState({...this.state, errors})
    }

    render() {
        return (
            <>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Link to={'/'}>
                            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" style={{ margin: '2px 20px', height: '40px' }} />
                        </Link>
                        <Link to={'/'} className="navbar-brand">Faculty of blockchain</Link>
                        {/* <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to={'/'} className="nav-link">Home</Link>
                            </li>
                        </ul> */}
                    </div>
                    {
                        !!this.props.selectedAccount &&
                        <div style={{ color: 'white', fontSize: 12 }}>
                            {this.props.selectedAccount}
                            <br />
                            {this.props.userName}
                        </div>
                    }
                </nav>
                {
                    this.state.errors.map((error, i) => (
                        <Alert key={error+i} variant="danger" onClose={() => this.removeError(i)} dismissible>
                            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                            <p>{error}</p>
                        </Alert>
                    ))
                }                
            </>
        )
    }
}

const mapStateToProps = state => {
    const userRole = getUserRole(state.users.professors || [], state.users.students || [], state.eth.selectedAccount)
    let userName = null
    if (userRole === USER_ROLES.PROFESSOR) {
        userName = state.users.professors?.find(x => x.id === state.eth.selectedAccount)?.name
    } else if (userRole === USER_ROLES.STUDENT) {
        userName = state.users.students?.find(x => x.id === state.eth.selectedAccount)?.name
    } else if (userRole === USER_ROLES.ADMIN) {
        userName = 'admin'
    }
    return {
        selectedAccount: state.eth.selectedAccount,
        userName,
    }
}

export default connect(mapStateToProps)(Navbar)