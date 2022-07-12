import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Alert from 'react-bootstrap/Alert';
import EventListenerService from "../utils/eventListenerService"

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

const mapStateToProps = state => ({
    selectedAccount: state.eth.selectedAccount,
})

export default connect(mapStateToProps)(Navbar)