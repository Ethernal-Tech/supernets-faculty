import { Button } from 'components/Button'
import { Link } from "react-router-dom"
import { noop } from 'utils/commonHelper'

export const LandingPage = () => {
    return (
        <div style={styles.container}>
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
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 24,
    },
    homeHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeText: {
        paddingTop: 32,
        textAlign: 'center',
    },
    enterButtonContainer: {
        marginTop: 32,
    }
}
