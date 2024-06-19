// import node module libraries
import { Fragment, useState, useEffect } from 'react';
import { Card, Col, Row, Container, Form, Button, Accordion, Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { AgGridTable } from 'sub-components';


const ExtraPlanModal = ({ mode, show, handleClose, editExtraPlanFormData }) => {

  const [extraPlans, setExtraPlans] = useState({
    planName: '',
    adultage: '',
    costAdult: '',
    childage: '',
    costChild: '',
    infantage: '',
    costInfant: ''
  });

  useEffect(() => {
    if (mode == 'edit') {
      setExtraPlans(editExtraPlanFormData);
    }
  }
  , [editExtraPlanFormData, mode]);

  const handleInputChange = (e) => {
    setExtraPlans({ ...extraPlans, [e.target.id]: e.target.value });
  }

  const resetExtraPlanForm = () => {
    setExtraPlans({
      planName: '',
      adultage: '',
      costAdult: '',
      childage: '',
      costChild: '',
      infantage: '',
      costInfant: ''
    });
    handleClose();
  }

  const submitExtraPlan = async (e) => {
    e.preventDefault();
    try {
      if (mode == 'edit') {
        const response = await axios.put(`${process.env.API_URL}/extrasplan/${editExtraPlanFormData.id}`, extraPlans);
        resetExtraPlanForm();
        return;
      }
      if (mode == 'add') {
        const response = await axios.post(`${process.env.API_URL}/extrasplan`, extraPlans);
        resetExtraPlanForm();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>

      <Modal.Header closeButton>
        <Modal.Title>{mode == 'add' ? 'Add Extra Plan' : 'Edit Extra Plan'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group as={Col} controlId="planName">
            <Form.Label>Plan Name</Form.Label>
            <Form.Control type="text" placeholder="Enter plan name" value={extraPlans.planName} onChange={handleInputChange} required />
          </Form.Group>
          <Row className="mb-3">
            <Col>
              <Form.Group as={Col} controlId="adultage">
                <Form.Label>Adult Min Age</Form.Label>
                <Form.Control type="number" placeholder="Enter age" value={extraPlans.adultage} onChange={handleInputChange} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group as={Col} controlId="costAdult">
                <Form.Label>Cost for Adult</Form.Label>
                <Form.Control type="number" placeholder="Enter cost for adult" value={extraPlans.costAdult} onChange={handleInputChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group as={Col} controlId="childage">
                <Form.Label>Child Min Age</Form.Label>
                <Form.Control type="number" placeholder="Enter age" value={extraPlans.childage} onChange={handleInputChange} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group as={Col} controlId="costChild">
                <Form.Label>Cost for Child</Form.Label>
                <Form.Control type="number" placeholder="Enter cost for child" value={extraPlans.costChild} onChange={handleInputChange} required />
              </Form.Group>
            </Col>

          </Row>

          <Row className="mb-3">

            <Col>
              <Form.Group as={Col} controlId="infantage">
                <Form.Label>Infant Min Age</Form.Label>
                <Form.Control type="number" placeholder="Enter age" value={extraPlans.infantage} onChange={handleInputChange} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group as={Col} controlId="costInfant">
                <Form.Label>Cost for Infant</Form.Label>
                <Form.Control type="number" placeholder="Enter cost for infant" value={extraPlans.costInfant} onChange={handleInputChange} required />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant='primary' type="submit" onClick={submitExtraPlan}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};



const ExtraPlan = () => {

  const [extraPlans, setExtraPlans] = useState([]);
  const [extraPlanCollection, setExtraPlanCollection] = useState([]);
  const [show, setShow] = useState(false);
  const [editExtraPlanFormData, setEditExtraPlanFormData] = useState({});
  const [mode, setMode] = useState('add');
  const handleClose = () => setShow(false);


  useEffect(() => {
    getExtraPlans();
  }, []);

  const getExtraPlans = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/extrasplan`);
      setExtraPlanCollection(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitExtraPlan = async (e) => {
    e.preventDefault();
    try {
      console.log(extraPlans)
      const extraPlanBody = {

        name: extraPlans.planName,
        adult:{
          age: extraPlans.adultage,
          extraCost: extraPlans.costAdult
        },
        child : {
          age: extraPlans.childage,
          extraCost: extraPlans.costChild
        },
        infant: {
          age: extraPlans.infantage,
          extraCost: extraPlans.costInfant
        }
      }
      console.log(extraPlanBody)
      const response = await axios.post(`${process.env.API_URL}/extrasplan`, extraPlanBody);
      resetExtraPlanForm();
      await getExtraPlans();
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (e) => {
    setExtraPlans({ ...extraPlans, [e.target.id]: e.target.value });
  };

  const resetExtraPlanForm = () => {
    setExtraPlans({
      planName: '',
      adultage: '',
      costAdult: '',
      childage: '',
      costChild: '',
      infantage: '',
      costInfant: ''
    });
  }

  const editExtraPlan = (extraPlan) => {
    const editExtraPlan = {
      planName: extraPlan.name,
      adultage: extraPlan.adult.age,
      costAdult: extraPlan.adult.extraCost,
      childage: extraPlan.child.age,
      costChild: extraPlan.child.extraCost,
      infantage: extraPlan.infant.age,
      costInfant: extraPlan.infant.extraCost
    }
    setEditExtraPlanFormData(editExtraPlan);
    setMode('edit');
    setShow(true);
  }

  const deleteExtraPlan = async (extraPlan) => {
    try {
      const response = await axios.delete(`${process.env.API_URL}/extrasplan/${extraPlan.id}`);
      getExtraPlans();
    } catch (error) {
      console.log(error);
    }
  } 

  const addButtonClick = () => {
    setMode('add');
    setShow(true);
  }

  const ActionButtonRenderer = (params) => {
    useEffect(() => {
      console.log('params', params.data);
      console.log(params);
    }, []);

    return (
      <>
        <DropdownButton id="dropdown-basic-button" title="Actions" size="sm">
          <Dropdown.Item onClick={(e) => editExtraPlan(params.data)} >Edit</Dropdown.Item>
          <Dropdown.Item onClick={(e) => deleteExtraPlan(params.data)} >Delete</Dropdown.Item>
        </DropdownButton>
      </>
    );
  };

  const columnDefs = [
    { headerName: 'Plan Name', field: 'name' },
    { headerName: 'Adult Age', field: 'adult.age' },
    { headerName: 'Cost for Adult', field: 'adult.extraCost' },
    { headerName: 'Child Age', field: 'child.age' },
    { headerName: 'Cost for Child', field: 'child.extraCost' },
    { headerName: 'Infant Age', field: 'infant.age' },
    { headerName: 'Cost for Infant', field: 'infant.extraCost' },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: ActionButtonRenderer,
    }
  ];

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-0 h2 fw-bold">Extra Plans</h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} style={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="primary" onClick={addButtonClick} >Add Extra Plan</Button>
        </Col>
      </Row>
      <Row>
      <AgGridTable columnDefs={columnDefs} rowData={extraPlanCollection} />
      <ExtraPlanModal mode={mode} show={show} handleClose={handleClose} editExtraPlanFormData={editExtraPlanFormData} />
      </Row>
    </Container>
  );
};

export default ExtraPlan;
