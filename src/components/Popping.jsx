import { Modal, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "../style/model.scss"
import { connect } from "react-redux";
import {Link} from "react-router-dom"
import { deleteEventApi, closeEvent } from "../Redux/actions";
import axios from "axios";

axios.defaults.withCredentials = true


const Popping = ({open, handleClose, event, deleteEventApi, renderStatus, rerender})=> {
   const {id, describe, title, start, end} = event;

   const handleDelete =async () => {
     await deleteEventApi(event.id);
     rerender(!renderStatus);
     handleClose();

   }

   const [emailid, setEmailid] = useState("");

   const getUser = async () => {
     try {
       const url = "https://classcraftbackend.onrender.com/auth/login/success";
       const { data } = await axios.get(url, { withCredentials: true,  crossDomain: true  });
       setEmailid(data.user._json.email);
     } catch (err) {
       console.log(err);
     }
   };

   useEffect(() => {
    getUser();
  }, []);

   

   const modal = ()=>{
     return (
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title className="text-capitalize">{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {describe? <p className="lead">{describe}</p>: "No Dsecriptions Yet"}
            <div className="row justify-content-between">
              <p className="col small text-muted text-center pb-0 mb-0">from: {start}</p>
              <p className="col small text-muted text-center pb-0 mb-0">to: {end}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
     
            <Button variant="warning" onClick={handleClose}>Close</Button>
            {emailid.endsWith("nd36@gmail.com") ? (<div className=""><Link to={`/event/${id}/update`}><Button variant="success" style={{marginRight:'0.5rem'}}>Update</Button></Link><Button variant="danger" onClick={handleDelete}>Delete</Button></div>) : (null) }
            
        </Modal.Footer>
      </Modal>
     )
   }

   if(id){
     return modal()
   }else{
     <p>there is no modal to preview</p>
   }
   
  }

  function mapStateToProps({event}){
     return {
       event,
      //  modalStatus
     }
  }
  
  export default connect(mapStateToProps, {deleteEventApi, closeEvent})(Popping)