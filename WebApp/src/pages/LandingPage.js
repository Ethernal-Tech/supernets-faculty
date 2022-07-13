import React from 'react'
import { Button, Container } from 'react-bootstrap'
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { USER_ROLES } from '../utils/constants';
import { getUserRole } from '../utils/userUtils';

const LandingPage = ({ userRole }) => {
    let navigate = useNavigate()

    return (
        <Container style={styles.container}>
            <h2>Welcome to Faculty of Blockchain</h2>
            <div style={styles.homeText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            {
                userRole !== USER_ROLES.GUEST &&
                <Button style={styles.enterButton} onClick={() => navigate('/home')}>
                    ENTER
                </Button>
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
    enterButton: {
        marginTop: 60,
        width: 200,
        height: 60
    }
}