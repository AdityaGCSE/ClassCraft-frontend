import React , { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popping from './Popping';
import {closeEvent, ShowEventApi, ShowEventsApi, ShowAllEventsApi} from "../Redux/actions"
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios';
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import AddEventsModal from "./AddEventsModal";

axios.defaults.withCredentials = true

const localizer = momentLocalizer(moment)

const MyCalendar = ({events, ShowEventApi, closeEvent, ShowEventsApi,onHide}) => {

    const [open, setOpen] = useState(false);
    const [renderStatus, rerender] = useState(false);

    const [allcourses,setAllcourses] = useState([]);

    const fetchDataAndLog = async () => {
      try {
        const dispatchFunction = ShowAllEventsApi(); // Call the outer function to get the inner function
        const fetchedData = await dispatchFunction(); // Call the inner function and await its response
        console.log("Fetched data:", fetchedData);
        setAllcourses([...new Set(fetchedData.map(item => item.title))]);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };

    useEffect(()=>{
      ShowEventsApi()
      console.log("i renderd because of refresh or start");
      fetchDataAndLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    useEffect(()=>{
      ShowEventsApi()
      console.log("i renderd");
      fetchDataAndLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[renderStatus])
   

    const openEventClick = (event)=>{
         setOpen(true)
         if(event.id) {
          ShowEventApi( event.id);
         }
         
         return;
    }

    const closeEventClick = () =>{
      setOpen(false);
      setTimeout(()=>closeEvent(),300) ;
    }

    const minTime = moment().set({ hours: 8, minutes: 0 }); // 8:00 AM
    const maxTime = moment().set({ hours: 18, minutes: 0 }); // 18:00 PM



      const dropdownItems = allcourses.map((title, index) => (
        <option key={index} value={title}>
          {title}
        </option>
      ));

      const [selectedTitle, setSelectedTitle] = useState(""); // State to hold the selected dropdown value
      const [errorMessage, setErrorMessage] = useState('');

      const handleDropdownChange = (event) => {
        setSelectedTitle(event.target.value); // Update the selected title when dropdown value changes
      };

      

      const [emailid, setEmailid] = useState("");

      const getUser = async () => {
        try {
          const url = "https://classcraftbackend.onrender.com/auth/login/success";
          const { data } = await axios.get(url, { withCredentials: true , crossDomain: true });
          setEmailid(data.user._json.email);
        } catch (err) {
          console.log(err);
        }
      };

      const logout = () => {
        window.open("https://classcraftbackend.onrender.com/auth/logout", "_self");
      };
    
      useEffect(() => {
        getUser();
      }, []);
    
      const handleFormSubmit = async (input) => {
        console.log(dropdownItems.map(option => option.props.value));
        if (!dropdownItems.map(option => option.props.value).includes(selectedTitle)) {
          setErrorMessage('Please select a valid course from the dropdown.');
          return;
        }
        input.preventDefault();
        const url = "https://classcraftbackend.onrender.com/api/studentcourses/addcourse/";
        const titlename = document.getElementById('course').value;
        const data = {
          title : titlename,
          emailid : emailid
        }
          axios.post(url, data)
          .then(res => {
            // Response from the backend is available in the 'response' object
            console.log('Response:', res.data);
      
          })
          .catch(error => {
            // Handle any errors that occurred during the request
            console.error('Error:', error);
          });
          window.location.reload();
      };

      const [showModal, setShowModal] = useState(false);
      const openModal = () => setShowModal(true);
      const closeModal = () => setShowModal(false);

    if(emailid!=="")
    return (
    <div>
      <nav className="navbar navbar-light bg-light">
     
        <div className="container-fluid align-items-center">
          <Link className="navbar-brand ms-2" to="/">
            <h3>ClassCraft</h3>
          </Link>
          {emailid.endsWith("nd36@gmail.com") ? (
            <div>
              <Button style={{backgroundColor:'rgb(220,230,255)',color:'black',fontWeight:'700', border:'1px solid black', outline:'4px solid rgb(50,170,255)',padding:'0rem 0.5rem',height:'45px'}} onClick={openModal}>
                Add Course <span style={{fontSize:'1.3225rem'}}>+</span>
              </Button>
              <AddEventsModal show={showModal} onHide={closeModal} />
            </div>
          ) : (
            <div>
            {/* <form id="courseForm" onSubmit={handleFormSubmit}> */}
            <label htmlFor="course" style={{fontWeight:'500'}}>Select a Course : &nbsp;</label>
            <input list="options" name="course" id="course" placeholder='Enter Course Name'  onChange={handleDropdownChange} style={{height:'2rem',padding:'0.1rem 0.2rem'}}/>
            <datalist name="course" id="options">
              {dropdownItems} {/* Include the dropdown items here */}
            </datalist>
            <input name="emailid"  value={emailid} type="hidden" />
            <button onClick={handleFormSubmit} style={{height:'2rem',padding:'0.1rem 0.2rem',backgroundColor:'rgb(80,110,255)',color:'white',borderRadius:'0px 4px 4px 0px'}}>Add</button>
            {errorMessage && <p style={{ color: 'red', fontSize: '14px' }}>{errorMessage}</p>}
            {/* </form> */}
          </div>
          )}

          <div className="">
            <Button className="" onClick={logout} variant='outline-primary'>
              Log Out
            </Button>
          </div>
        </div>

      </nav>

        <Popping open={open}
         handleOpen={openEventClick} 
         handleClose={closeEventClick} 
         renderStatus = {renderStatus}
         rerender= {rerender}/>
         
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 , margin: 50, fontFamily: 'Patrick Hand' }}
            onSelectEvent={openEventClick}
            views={['day','week','month']}
            // defaultView='week'
            min={minTime}
            max={maxTime}
        />
    </div>      
    )
    else return(
      <div className="">
        <Calendar
         localizer={localizer}
            style={{ height: 500 , margin: 50, fontFamily: 'Patrick Hand' }}
            views={['day','week','month']}
            // defaultView='week'
        />
      </div>
    )
}

function mapStateToProps({event, events}){
  return{
    event,
    events
  }
}

export default connect(mapStateToProps, {ShowEventApi, closeEvent, ShowEventsApi})(MyCalendar)