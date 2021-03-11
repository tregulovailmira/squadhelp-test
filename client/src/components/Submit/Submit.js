import React from 'react';
import { Modal, Button } from 'react-bootstrap';


const ModalSubmit = (props) => {
    const {closeModal,denied, submit, show} = props;
    return (
        <Modal show={show} onHide={closeModal}>
            <Modal.Header closeButton onClick={closeModal}>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={denied}>
                    Close
                </Button>
                <Button variant="primary" onClick={submit}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    )
};


export default ModalSubmit
