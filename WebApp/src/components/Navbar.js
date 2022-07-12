import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ padding: '0.5rem' }}>
                <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start' }}>
                    <Link to={'/'} className="navbar-brand">Faculty</Link>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to={'/'} className="nav-link">Home</Link>
                        </li>
                    </ul>
                </div>
                {
                    !!this.props.selectedAccount &&
                    <div style={{ color: 'white', fontSize: 12 }}>
                        {this.props.selectedAccount}
                    </div>
                }
            </nav>
        )
    }
}

const mapStateToProps = state => ({
    selectedAccount: state.eth.selectedAccount,
})

export default connect(mapStateToProps)(Navbar)