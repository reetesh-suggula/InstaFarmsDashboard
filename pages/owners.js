// import node module libraries
import { Fragment, useEffect, useState } from 'react';
import { Card, Col, Row, Container, Accordion, Table } from 'react-bootstrap';
import { Form, Button, DropdownButton, Dropdown, Modal, Tab, Nav } from 'react-bootstrap';
import ReactStars from 'react-stars'
import axios from 'axios';
import { Country, State, City } from 'country-state-city';
import { AgGridTable } from 'sub-components';



const OwnerModal = ({ mode, show, handleClose, editOwnerFormData }) => {
  const accountTypes = [
    "Savings Account",
    "Current Account",
    "Fixed Deposit",
    "Recurring Deposit",
    "NRI Account",
  ];

  const getCitiesByStateName = (stateName) => {
    const state = State.getStatesOfCountry("IN").find(state => state.name === ownerDetails.state);
    console.log(state);
    return City.getCitiesOfState("IN", state?.isoCode);
    // setCities(City.getCitiesOfState("IN", state?.isoCode));
  }

  const [ownerDetails, setOwerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsappNumber: '',
    address: '',
    state: '',
    city: '',
    zip: '',
    alternatePersonName: '',
    alternateNumber: '',
    relation: '',
    accountNumber: '',
    bankName: '',
    accountType: '',
    ifsc: '',
    pan: '',
    gst: ''
  });

  const [owners, setOwners] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (mode == 'edit') {
      setOwerDetails(editOwnerFormData);
    }
  }, [editOwnerFormData, mode]);

  const handleInputChange = (e) => {
    setOwerDetails({ ...ownerDetails, [e.target.id]: e.target.value });
    if (e.target.id === 'state') {
      getCitiesByStateName(e.target.value);
    }
  }

  const submitOwnerDetails = async (e) => {
    e.preventDefault();
    try {
      const ownerBody = {
        firstName: ownerDetails.firstName,
        lastName: ownerDetails.lastName,
        email: ownerDetails.email,
        whatsappNumber: ownerDetails.whatsappNumber,
        address: {
          address: ownerDetails.address,
          state: ownerDetails.state,
          city: ownerDetails.city,
          zip: ownerDetails.zip
        },
        alternateContactDetails: {
          name: ownerDetails.alternatePersonName,
          phoneNumber: ownerDetails.alternateNumber,
          relation: ownerDetails.relation
        },
        bankDetails: {
          accountNumber: ownerDetails.accountNumber,
          bankName: ownerDetails.bankName,
          accountType: ownerDetails.accountType,
          ifsc: ownerDetails.ifsc
        },
        gstIn: ownerDetails.gst,
        panNumber: ownerDetails.pan
      }
      const response = await axios.post(`${process.env.API_URL}/owner`, ownerBody);
      resetOwnerForm();
    } catch (error) {
      console.log(error);
    }
  }

  const resetOwnerForm = () => {
    setOwerDetails({
      firstName: '',
      lastName: '',
      email: '',
      whatsappNumber: '',
      address: '',
      state: '',
      city: '',
      zip: '',
      alternatePersonName: '',
      alternateNumber: '',
      relation: '',
      accountNumber: '',
      bankName: '',
      accountType: '',
      ifsc: '',
      pan: '',
      gst: ''
    });
    handleClose();
  }

  return (

    <Modal show={show} onHide={handleClose}  dialogClassName='owner-modal'>
      <Modal.Header closeButton>
        <Modal.Title> {mode == 'add' ? 'AddOwner' : 'Edit Owner'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="BasicDetails">
          <Nav className="nav-lb-tab">
            <Nav.Item>
              <Nav.Link eventKey="BasicDetails" className="mb-sm-3 mb-md-0">
                Basic Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="AlternateContactDetails" className="mb-sm-3 mb-md-0">
                Alternate Contact Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="BankDetails" className="mb-sm-3 mb-md-0">
                Bank Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="TaxDetails" className="mb-sm-3 mb-md-0">
                Tax Details
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Form onSubmit={submitOwnerDetails}>
            <Tab.Content>
              <Tab.Pane eventKey="BasicDetails" className="pb-4 p-4">
                <Row>

                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter first name" required onChange={handleInputChange} />
                  </Form.Group>


                  <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" onChange={handleInputChange} required />
                  </Form.Group>


                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={handleInputChange} required />
                  </Form.Group>


                  <Form.Group className="mb-3" controlId="whatsappNumber">
                    <Form.Label>WhatsApp Phone Number</Form.Label>
                    <Form.Control type="text" placeholder="Enter Phone Number" onChange={handleInputChange} required />
                  </Form.Group>


                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter address" onChange={handleInputChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="state">
                    <Form.Label>State</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} required>
                      {State.getStatesOfCountry("IN").map((type) => (
                        <option key={type.name}>{type.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} required>
                      {getCitiesByStateName().map((type) => (
                        <option key={type.name}>{type.name}</option>
                      ))}
                    </Form.Control>
                    {/* <Form.Control type="text" placeholder="Enter city" required /> */}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="zip">
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control type="text" placeholder="Enter pincode" onChange={handleInputChange} required />
                  </Form.Group>

                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="AlternateContactDetails" className="pb-4 p-4 react-code">
                <Row>

                  <Form.Group className="mb-3" controlId="alternatePersonName">
                    <Form.Label>Person Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Person Name" onChange={handleInputChange} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="alternateNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" placeholder="Enter Phone Number" onChange={handleInputChange} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="relation">
                    <Form.Label>Relation</Form.Label>
                    <Form.Control type="text" placeholder="Enter relation" onChange={handleInputChange} />
                  </Form.Group>

                </Row>

              </Tab.Pane>

              <Tab.Pane eventKey="BankDetails" className="pb-4 p-4 react-code">
                <Row>

                  <Form.Group className="mb-3" controlId="accountNumber">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control type="text" placeholder="Enter account number" onChange={handleInputChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="bankName">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter bank name" onChange={handleInputChange} required />
                  </Form.Group>


                  <Form.Group className="mb-3" controlId="accountType">
                    <Form.Label>Account Type</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} required>
                      {accountTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="ifsc">
                    <Form.Label>IFSC</Form.Label>
                    <Form.Control type="text" placeholder="Enter IFSC" onChange={handleInputChange} required />
                  </Form.Group>

                </Row>

              </Tab.Pane>
              <Tab.Pane eventKey="TaxDetails" className="pb-4 p-4 react-code">
                <Row>

                  <Form.Group className="mb-3" controlId="pan">
                    <Form.Label>PAN</Form.Label>
                    <Form.Control type="text" placeholder="Enter PAN" onChange={handleInputChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="gst">
                    <Form.Label>GST</Form.Label>
                    <Form.Control type="text" placeholder="Enter GST" onChange={handleInputChange} />
                  </Form.Group>

                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Form>
        </Tab.Container>


        {/* <Form onSubmit={submitOwnerDetails}>
          <h4>Basic Details</h4>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter first name" required onChange={handleInputChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter last name" onChange={handleInputChange} required />
              </Form.Group>
            </Col>

          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={handleInputChange} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="whatsappNumber">
                <Form.Label>WhatsApp Phone Number</Form.Label>
                <Form.Control type="text" placeholder="Enter Phone Number" onChange={handleInputChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Enter address" onChange={handleInputChange} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control as="select" onChange={handleInputChange} required>
                  {State.getStatesOfCountry("IN").map((type) => (
                    <option key={type.name}>{type.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control as="select" onChange={handleInputChange} required>
                  {getCitiesByStateName().map((type) => (
                    <option key={type.name}>{type.name}</option>
                  ))}
                </Form.Control>
                <Form.Control type="text" placeholder="Enter city" required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="zip">
                <Form.Label>Pincode</Form.Label>
                <Form.Control type="text" placeholder="Enter pincode" onChange={handleInputChange} required />
              </Form.Group>
            </Col>
          </Row>

          <h4>Alternate Contact Details</h4>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="alternatePersonName">
                <Form.Label>Person Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Person Name" onChange={handleInputChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="alternateNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" placeholder="Enter Phone Number" onChange={handleInputChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="relation">
                <Form.Label>Relation</Form.Label>
                <Form.Control type="text" placeholder="Enter relation" onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>

          <h4>Bank Details</h4>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="accountNumber">
                <Form.Label>Account Number</Form.Label>
                <Form.Control type="text" placeholder="Enter account number" onChange={handleInputChange} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="bankName">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control type="text" placeholder="Enter bank name" onChange={handleInputChange} required />
              </Form.Group>

            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="accountType">
                <Form.Label>Account Type</Form.Label>
                <Form.Control as="select" onChange={handleInputChange} required>
                  {accountTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="ifsc">
                <Form.Label>IFSC</Form.Label>
                <Form.Control type="text" placeholder="Enter IFSC" onChange={handleInputChange} required />
              </Form.Group>
            </Col>
          </Row>

          <h4>TAX Details</h4>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="pan">
                <Form.Label>PAN</Form.Label>
                <Form.Control type="text" placeholder="Enter PAN" onChange={handleInputChange} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="gst">
                <Form.Label>GST</Form.Label>
                <Form.Control type="text" placeholder="Enter GST" onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>
          <h4>Owner rating</h4> 
           <ReactStars
                  count={5}
                  size={24}
                  color2={'#ffd700'} /> 
        </Form> */}
      </Modal.Body>

      <Modal.Footer>

        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant='primary' onClick={submitOwnerDetails}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}



const Documentation = () => {

  const [ownerDetails, setOwerDetails] = useState({});
  const [owners, setOwners] = useState([]);
  const [cities, setCities] = useState([]);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('add');
  const [editOwnerFormData, setEditOwnerFormData] = useState({});
  const handleClose = () => setShow(false);
  const addButtonClick = () => {
    setMode('add');
    setShow(true);
  }



  const handleInputChange = (e) => {
    setOwerDetails({ ...ownerDetails, [e.target.id]: e.target.value });
    if (e.target.id === 'state') {
      getCitiesByStateName(e.target.value);
    }
  }

  useEffect(() => {
    getOwnerDetails();
  }, []);

  const editButtonClick = (data) => {
    setMode('edit');
    setEditOwnerFormData(data);
    setShow(true);
  }

  const deleteButtonClick = async (data) => {
    try {
      const response = await axios.delete(`${process.env.API_URL}/owner/${data._id}`);
      getOwnerDetails();
    } catch (error) {
      console.log(error);
    }
  }

  const ActionButtonRenderer = ({ data }) => {
    return (
      <DropdownButton id="dropdown-basic-button" title="Actions">
        <Dropdown.Item onClick={() => editButtonClick(data)}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={() => deleteButtonClick(data)}>Delete</Dropdown.Item>
      </DropdownButton>
    );
  };

  const columnDefs = [
    { headerName: 'First Name', field: 'firstName' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'WhatsApp Number', field: 'whatsappNumber' },
    { headerName:'Actions', field: 'actions', cellRenderer: ActionButtonRenderer}
  ]

  const getOwnerDetails = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/owner`);
      console.log(response.data);
      setOwners(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCitiesByStateName = (stateName) => {
    const state = State.getStatesOfCountry("IN").find(state => state.name === ownerDetails.state);
    console.log(state);
    return City.getCitiesOfState("IN", state?.isoCode);
    // setCities(City.getCitiesOfState("IN", state?.isoCode));
  }



  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-0 h2 fw-bold">Owners</h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Owner Details</h4>
            <Button variant="primary" onClick={addButtonClick}>Add Owner</Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <AgGridTable columnDefs={columnDefs} rowData={owners} />
          <OwnerModal mode={mode} show={show} handleClose={handleClose} editOwnerFormData={editOwnerFormData} />
        </Col>
      </Row>
    </Container>
  );
};

export default Documentation;
