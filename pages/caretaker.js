// import node module libraries
import { Fragment, useState, useEffect } from 'react';
import { Card, Col, Row, Container, Accordion } from 'react-bootstrap';
import { Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { AgGridTable } from 'sub-components';

const CareTaker = () => {

  // const columnDefs = [
  //   { headerName: 'Make', field: 'make' },
  //   { headerName: 'Model', field: 'model' },
  //   { headerName: 'Price', field: 'price' },
  // ];

  // const rowData = [
  //   { make: 'Toyota', model: 'Celica', price: 35000 },
  //   { make: 'Ford', model: 'Mondeo', price: 32000 },
  //   { make: 'Porsche', model: 'Boxster', price: 72000 },
  // ];

//   const columnDefs = [
//     { headerName: 'ID', field: 'id' },
//     { headerName: 'Name', field: 'name' },
//     { headerName: 'Age', field: 'age' },
//     { headerName: 'Country', field: 'country' },
// ];

//   const rowData = [
//       { id: 1, name: 'John Doe', age: 30, country: 'USA' },
//       { id: 2, name: 'Jane Smith', age: 25, country: 'Canada' },
//       { id: 3, name: 'Bob Johnson', age: 40, country: 'UK' }
//   ];

  const [caretakerFormData, setCaretakerFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: ''
  });
  const [caretakers, setCaretakers] = useState([]);

  const columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'First Name', field: 'firstname' },
    { headerName: 'Last Name', field: 'lastname' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Phone Number', field: 'phonenumber' }
  ]


  useEffect(() => {
    getCaretakers();
  }
    , []);

  const caretakerChange = (e) => {
    setCaretakerFormData({ ...caretakerFormData, [e.target.name]: e.target.value.toLowerCase() });
  }

  const caretakerSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(caretakerFormData)
      const response = await axios.post(`${process.env.API_URL}/caretaker`, caretakerFormData);
      resetCaretakerForm();
      await getCaretakers();
    } catch (error) {
      console.log(error);
    }
  }

  const getCaretakers = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/caretaker`);
      console.log(response.data);
      setCaretakers(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const resetCaretakerForm = () => {
    setCaretakerFormData({
      firstname: '',
      lastname: '',
      email: '',
      phonenumber: ''
    });
  }


  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-0 h2 fw-bold">Care Takers</h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <AgGridTable columnDefs={columnDefs} rowData={caretakers} />
          {/* <Card>
            <Card.Body>
             
              <Accordion>
                {caretakers.map((caretaker, index) => (
                  <Accordion.Item eventKey={index + 1} key={index}>
                    <Accordion.Header>{caretaker.firstname} {caretaker.lastname}</Accordion.Header>
                    <Accordion.Body>
                      <Table>
                        <tbody>
                          <tr>
                            <td>First Name</td>
                            <td>{caretaker.firstname}</td>
                          </tr>
                          <tr>
                            <td>Last Name</td>
                            <td>{caretaker.lastname}</td>
                          </tr>
                          <tr>
                            <td>Email</td>
                            <td>{caretaker.email}</td>
                          </tr>
                          <tr>
                            <td>Phone Number</td>
                            <td>{caretaker.phonenumber}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card> */}
        </Col>
      </Row>
      <Row>
        <Col lg={7} md={12} sm={12}>
          <Card>
            <Card.Body>
              <Form onSubmit={caretakerSubmit}>
                <Form.Group className="mb-3" >
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter first name"
                    id="firstname"
                    name="firstname"
                    value={caretakerFormData.firstname}
                    onChange={caretakerChange} />
                </Form.Group>

                <Form.Group className="mb-3" >
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter last name"
                    id="lastname"
                    name="lastname"
                    value={caretakerFormData.lastname}
                    onChange={caretakerChange} />
                </Form.Group>

                <Form.Group className="mb-3" >
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter Email"
                    id="email"
                    name="email"
                    value={caretakerFormData.email}
                    onChange={caretakerChange} />
                </Form.Group>

                <Form.Group className="mb-3" >
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="number" placeholder="Enter phone number"
                    id="phonenumber"
                    name="phonenumber"
                    value={caretakerFormData.phonenumber}
                    onChange={caretakerChange} required />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CareTaker;
