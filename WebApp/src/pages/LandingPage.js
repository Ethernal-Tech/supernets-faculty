import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { Button } from 'components/Button'
import { Link } from "react-router-dom"
import { connect } from 'react-redux'
import { setSelectedEventAction } from 'actions/eventActions'
import { noop } from 'utils/commonHelper'

function LandingPage(props){

    useEffect(() => {
        props.setSelectedEvent(null)
    }, [])

    return (
        <Container style={styles.container}>
            <div style={styles.homeHeader}>
                <img style={{ marginRight: 30 }} src={`${process.env.PUBLIC_URL}/logoplan.png`}  alt="logoplan" />
                <h1 style={{ marginBottom: 0 }}>Welcome to Faculty of Blockchain</h1>
            </div>
            <div style={styles.homeText}>
                This is a show case platform tailored made for the purpose of Lugano PlanB Summer School. <br />
                It represents a demo of the first phase of entire school-students management platform development.
            </div>

            <Link style={styles.enterButtonContainer} to={'/events'}>
				<Button
					text='Enter'
					onClick={noop}
				/>
            </Link>
        </Container>
    )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    setSelectedEvent: (event) => setSelectedEventAction(event, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage)

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 60,
    },
    homeHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeText: {
        paddingTop: 60,
        textAlign: 'center',
    },
    enterButtonContainer: {
        marginTop: 60,
    },
    enterButton: {
        width: 200,
        height: 60
    }
}
