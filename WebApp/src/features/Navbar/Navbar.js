import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Alert from 'react-bootstrap/Alert';
import { getUserName } from 'utils/userUtils'

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { counter: 0, errors: [] }
    }

    removeError(idx) {
        const errors = this.state.errors.filter((_, i) => i !== idx)
        this.setState({...this.state, errors})
    }

    render() {
        const { selectedAccount, userName } = this.props

        return (
            <>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Link to={'/'}>
                            <img
								src={`${process.env.PUBLIC_URL}/logo.png`}
								alt="logo"
								style={{ margin: '2px 15px', height: '40px' }}
							/>
                        </Link>
                        <Link to={'/'} className="navbar-brand" style={{ fontSize: '16px', marginRight: '24px' }}>Faculty of blockchain</Link>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to={'/events'} className="nav-link">Events</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/'} className="nav-link">About</Link>
                            </li>
                        </ul>
                    </div>
                    {!!selectedAccount &&
                        <div style={{ fontSize: 14 }}>
                            {userName}
                            <br />
                            {selectedAccount}
                        </div>
                    }
                </nav>
            </>
        )
    }
}

const mapStateToProps = state => {
    const userName = getUserName(state)
    return {
        selectedAccount: state.eth.selectedAccount,
        userName,
    }
}

export default connect(mapStateToProps)(Navbar)
