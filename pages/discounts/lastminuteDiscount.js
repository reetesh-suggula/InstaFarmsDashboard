// import node module libraries
import { Fragment, useState, useEffect } from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { Accordion, Nav, Tab, Form, Button, Table, Badge, Stack, Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import { AgGridTable } from 'sub-components';
import axios from 'axios';
import { Discount } from '@mui/icons-material';

const LastMinuteDiscountsModal = ({ mode, show, handleClose, editDiscountFormData }) => {
  const [discountsFormData, setDiscountsFormData] = useState({
    name: '',
    nightsDiscountMapping: {},
    discountType: 'LastNight'
  });

  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    if (mode == 'edit') {
      setDiscountsFormData(editDiscountFormData);
    }
  }, [editDiscountFormData, mode]);

  const discountChange = (e) => {
    setDiscountsFormData({ ...discountsFormData, [e.target.name]: e.target.value });
  }

  const resetDiscountForm = () => {
    setDiscountsFormData({
      name: '',
      nightsDiscountMapping: {},
    });
    setDiscounts([]);
    handleClose();
  };

  const discountSubmit = async (e) => {
    e.preventDefault();
    try {
      if(mode == 'edit') {
        const response = await axios.put(`${process.env.API_URL}/discounts/${editDiscountFormData.id}`, discountsFormData);
        resetDiscountForm();
        return;
      }
      if(mode == 'add') {
        const response = await axios.post(`${process.env.API_URL}/discounts`, discountsFormData);
        resetDiscountForm();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddDay = () => {
    setDiscounts([...discounts, { day: '', discount: '' }]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDiscounts = [...discounts];
    updatedDiscounts[index][name] = value;
    setDiscounts(updatedDiscounts);
    setDiscountsFormData({ ...discountsFormData, nightsDiscountMapping: { ...discountsFormData.nightsDiscountMapping, [updatedDiscounts[index].day]: parseInt(updatedDiscounts[index].discount) } });
  };

  const handleDeleteDay = (index) => {
    const updatedDiscounts = [...discounts];
    updatedDiscounts.splice(index, 1);
    setDiscounts(updatedDiscounts);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title> {mode == 'add' ? 'Add Discount' : 'Edit Discount'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={discountSubmit}>
          <Form.Label className="col-sm-2" htmlFor="name">
            <strong>Name:</strong>
          </Form.Label>
          <Col md={8} xs={10}>
            <Form.Control

              type="text"
              placeholder="Enter Discount Name"
              id="name"
              name="name"
              value={discountsFormData.name}
              onChange={discountChange}
              required
            />
          </Col>
          <br></br>
          <h4>Discounts Per Night</h4>
          {discounts.map((discount, index) => (
            <div key={index}>
              <Row>
                <Col>

                  <Form.Group controlId={`day-${index}`}>
                    <Form.Label>Number of Nights</Form.Label>
                    <Form.Control
                      type="number"
                      name="day"
                      value={discount.day}
                      onChange={(event) => handleInputChange(index, event)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId={`discount-${index}`}>
                    <Form.Label>Discount</Form.Label>
                    <Form.Control
                      type="number"
                      name="discount"
                      value={discount.discount}
                      onChange={(event) => handleInputChange(index, event)}
                      required
                    />

                  </Form.Group>
                </Col>
                <Col>
                  <br></br>
                  <Button variant="danger" onClick={() => handleDeleteDay(index)}>
                    Delete
                  </Button>
                </Col>
              </Row>
              <br></br>
            </div>
          ))}
          <br></br>
          <Button variant="primary" onClick={handleAddDay}>
            Add Night Discount
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant='primary' type="submit" onClick={discountSubmit}>Submit</Button>
      </Modal.Footer>
    </Modal>
  )
};




const LastMinutesDiscounts = () => {
  const [discountsFormData, setDiscountsFormData] = useState({
    name: '',
    nightsDiscountMapping: {}
  });
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('add');
  const [editDiscountFormData, setEditDiscountFormData] = useState({});


  const [discountCollection, setDiscountCollection] = useState([]);
  useEffect(() => {
    getDiscounts();
  }, []);



  const getDiscounts = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/discounts`);
      const discounts = []
      if(response && response.data && response.data.length > 0) {
        response.data.forEach((discount) => {
          if(discount.type == 'LastNight'){
            discounts.push(discount);
          }
        });
      }
      setDiscountCollection(discounts);
      setDiscountCollection(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const NightDiscountsTableRenderer = (params) => {
    useEffect(() => {
      console.log('discounts');
      console.log(params.value);
    }, []);

    return (
      <>
        {params.value && Object.keys(params.value).map((key, index) => (
          <p key={key}>{key} Nights: {params.value[key]}%</p>
        ))}
        {/* <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nights</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {params.value && Object.keys(params.value)
            .map((key, index) => (
              <tr key={index}>
                <td>{key}</td>
                <td>{params.value[key]}</td>
              </tr>
            ))}
        </tbody>
      </Table> */}
      </>
    );
  };

  const editDiscount = (data) => {
    setMode('edit');
    setEditDiscountFormData(data);
    setShow(true);
  };

  const deleteDiscount = (data) => {
    try {
      const response = axios.delete(`${process.env.API_URL}/discounts/${data.id}`);
      getDiscounts();
    } catch (error) {
      console.log(error);
    }
  };

  const ActionButtonRenderer = (params) => {
    useEffect(() => {
      console.log(params);
    }, []);

    return (
      <>
        <DropdownButton id="dropdown-basic-button" title="Actions" size="sm">
          <Dropdown.Item onClick={(e) => editDiscount(params.data)} >Edit</Dropdown.Item>
          <Dropdown.Item onClick={(e) => deleteDiscount(params.data)} >Delete</Dropdown.Item>
        </DropdownButton>
      </>
    );
  };

  const handleClose = () => {
    setShow(false);
  };

  const addButtonClick = () => {
    setMode('add');
    setShow(true);
  };


  const columnDefs = [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Discounts", field: "nightsDiscountMapping", cellRenderer: NightDiscountsTableRenderer },
    { headerName: "Actions", field: "actions", cellRenderer: ActionButtonRenderer }
  ];

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-0 h2 fw-bold">Discounts</h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} style={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="primary" onClick={addButtonClick} >Add Discount Per Night</Button>
        </Col>
      </Row>
      <Row>
        <Col lg={7} md={12} sm={12}>
          <Card>
            <Card.Body>
              <AgGridTable columnDefs={columnDefs} rowData={discountCollection} rowHeight={200}  ></AgGridTable>
              <LastMinuteDiscountsModal mode={mode} show={show} handleClose={handleClose} editDiscountFormData={editDiscountFormData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LastMinutesDiscounts;
