import React from 'react'
import { Button, Container } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"

import { USER_ROLES } from '../utils/constants'
import { getUserRole } from '../utils/userUtils'

const LandingPage = ({ userRole }) => {

    return (
        <Container style={styles.container}>
            <h2>Welcome to Faculty of Blockchain</h2>
            <div style={styles.homeText}>
                This is a show case platform tailored made for the purpose of Lugano PlanB Summer School. 
                It represents a demo of the first phase of entire school-students management platform development.
            </div>

            {
                userRole !== USER_ROLES.GUEST &&
                <Link style={styles.enterButtonContainer} to={'/home'}>
                    <Button style={styles.enterButton}>
                        ENTER
                    </Button>
                </Link>
            }
        </Container>
    )
}

const mapStateToProps = state => {
    const userRole = getUserRole(state)
    return {
        userRole,
    }
}

export default connect(mapStateToProps)(LandingPage)

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 60,
    },
    homeText: {
        paddingTop: 60,
    },
    enterButtonContainer: {
        marginTop: 60,
    },
    enterButton: {
        width: 200,
        height: 60
    }
}