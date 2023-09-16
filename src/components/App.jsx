import React from "react";
import { Route, Routes, Navigate} from "react-router-dom"
import MyCalendar from "./Calendar";
import "../style/global.scss"
import AddEvents from "./AddEvents";
import UpdateEvent from "./UpdateEvent";
import {useState, useEffect } from "react";
import axios from "axios";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

function App() {


  const [user, setUser] = useState(null);

	const getUser = async () => {
		try {
			const url = "https://classcraftbackend.onrender.com/auth/login/success";
			const response = await axios.get(url, { withCredentials: true, crossDomain: true });
      console.log(response.status);
      if (response.status === 403) {
        // Redirect to signup page
        window.location.href = "/signup";
      }
			else
      {
        setUser(response.data.user._json);
      }
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getUser();
	}, []);


  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // console.log(user);
  return (
    <>
    <Routes>
      {/* <Route  path="/" exact element={<MyCalendar/>}/> */}
      <Route path="/" element={user ? <MyCalendar user={user} /> : <Navigate to="/login" />} show={showModal} onHide={closeModal}/>
      <Route
					exact
					path="/login"
					element={user ? <Navigate to="/" /> : <Login />}
				/>
      <Route
					exact
					path="/signup"
					element={ <Signup />}
				/>
      <Route path="/events/add" element={<AddEvents/>}/>
      <Route path="/event/:id/update" element={<UpdateEvent/>}/>
    </Routes>
    </>
  );
}



export default (App)