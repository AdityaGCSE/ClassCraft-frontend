import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import { Button } from "react-bootstrap";


const localizer = momentLocalizer(moment)

function Login() {
	const googleAuth = () => {
		try {
			window.open(
				"https://classcraftbackend.onrender.com/auth/google/callback",
				"_self"
			);
		} catch (error) {
			console.error("An error occurred:", error);
		}
	};
	
	return (
		<div className="">

			<nav className="navbar navbar-light bg-light">
				<div className="container-fluid align-items-center">
					<Link className="navbar-brand ms-2" to="/">
						<h3>ClassCraft</h3>
					</Link>
				<div>
					<Button className="" onClick={googleAuth} variant="outline-primary">
						{/* <img src="./images/google.png" alt="google icon" /> */}
						<span>Log In / Signup</span>
					</Button>
				</div>
				</div>
			</nav>


			{/* <h1 className={styles.heading}>Log in Form</h1>
			<div className={styles.form_container}>
				
				<div className={styles.right}>
					<h2 className={styles.from_heading}>Members Log in</h2>
					<input type="text" className={styles.input} placeholder="Institute Email ID" />
					<input type="text" className={styles.input} placeholder="Password" />
					<button className={styles.btn}>Log In</button>
					<p className={styles.text}>or</p> */}
					<Calendar
         localizer={localizer}
            style={{ height: 500 , margin: 50, fontFamily: 'Patrick Hand' }}
            views={['day','week','month']}
            // defaultView='week'
        />
					{/* <p className={styles.text}>
						New Here ? <Link to="/signup">Sing Up</Link>
					</p>
				</div>
			</div> */}
		</div>
	);
}

export default Login;
