import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AddEvents from "./AddEvents"; 

const AddEventsModal = ({ show, onHide }) => {

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddEvents modalonsubmit={onHide}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEventsModal;
