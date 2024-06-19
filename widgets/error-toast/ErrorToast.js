import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

export const ErrorToast = ({ errorMessage }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    
    <ToastContainer position="top-end">
    {/* Toast */}
    <Toast show={show} onClose={handleClose} delay={3000} autohide>
      <Toast.Header closeButton={false}>
        <strong className="mr-auto">Error</strong>
      </Toast.Header>
      <Toast.Body>{errorMessage}</Toast.Body>
    </Toast>
  </ToastContainer>
  );
};