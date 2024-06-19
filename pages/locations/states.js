// import node module libraries
import { useEffect } from 'react';
import { Col, Row, Card, Tab, Container, Form, Button, DropdownButton, Dropdown, Modal } from 'react-bootstrap';
import { ErrorToast } from "widgets";
import { useState } from 'react';
import axios from 'axios';
import { AgGridTable } from 'sub-components';
import { addState, getStates, updateState, deleteState } from 'data/apis/locations';


const StateFormModal = ({  mode , show, handleClose, editStateFormData}) => {

  const [stateFormData, setStateFormData] = useState({id:'', name: '' });

  useEffect(() => {
    if (mode == 'edit') {
      setStateFormData(editStateFormData);
    }
  }, [editStateFormData, mode]);

  const stateSubmit = async (e) => {
    e.preventDefault();
    try {
      if(mode == 'add' && stateFormData.name && stateFormData.name.length > 0) {
        const response = await addState(stateFormData);
      }
      if(mode == 'edit' && stateFormData.name && stateFormData.name.length > 0) {
        const response = await updateState(stateFormData);
      }
      stateReset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const stateReset = () => {
    setStateFormData({ name: '' , id: ''});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title> {mode == 'add' ? 'Add State' : 'Edit State'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={stateSubmit}>
          <Form.Group className="mb-3" controlId="stateName">
            <Form.Label>State Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter State Name"
              value={stateFormData.name}
              onChange={(e) => setStateFormData({ ...stateFormData, name: e.target.value })}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant='primary' type="submit" onClick={stateSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


const States = () => {
  const [states, setStates] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [mode, setMode] = useState();
  
  const fetchStates = async () => {
    try {
      const data = await getStates();
      setStates(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const stateDelete = async (id) => {
    try {
      const response = await deleteState(id);
      fetchStates();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error);
    }
  };

  
  const ActionButtonRenderer = (params) => {
    return (
      <>
      <DropdownButton id="dropdown-basic-button" title="Actions" size="sm">
        <Dropdown.Item onClick={() => editButtonClick(params.data.id)}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={() => stateDelete(params.data.id)}>Delete</Dropdown.Item>
      </DropdownButton>
      </>
    );
  };

  const openModal = (data) => {
    setModalData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalData({});
    setShowModal(false);
    fetchStates();
    setMode('');
  };

  const addButtonClick = () => {
    setMode('add');
    openModal({});
  };

  const editButtonClick = (id) => {
    setMode('edit');
    const state = states.find((state) => state.id === id);
    if (state) {
      openModal(state);
    }
  };

  const columnDefs = [
    {
      headerName: 'State Name',
      field: 'name',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: ActionButtonRenderer,
    },
  ];

  return (
    <Container fluid className="p-6">
      {errorMessage.length > 0 && <ErrorToast errorMessage={errorMessage} />}
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">States</h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} style={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="primary" onClick={addButtonClick} >Add New State</Button>
        </Col>
      </Row>
      <br></br>

      <Row>
        <Col xl={12} lg={12} md={12} sm={12}>
          <Tab.Container defaultActiveKey="all">
            <Card>
              <Card.Body>
                <AgGridTable columnDefs={columnDefs} rowData={states} ></AgGridTable>
                <StateFormModal 
                mode={mode}
                show={showModal}
                handleClose={closeModal}
                editStateFormData={modalData}
                />
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default States;