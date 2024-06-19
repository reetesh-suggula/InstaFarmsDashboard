// import node module libraries
import { Fragment, useState, useEffect } from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { Accordion, Nav, Tab, Form, Button, Table, Badge, Stack } from 'react-bootstrap';
import axios from 'axios';

const Discounts = () => {
  const [discountsFormData, setDiscountsFormData] = useState({
    name: '',
    nightsDiscountMapping: {},
    lastMinuteDaysDiscountMapping: {},
  });

  const [discounts, setDiscounts] = useState([]);
  const [lastMinuteDaysDiscount, setLastMinuteDaysDiscount] = useState([]);
  const [defaultDiscount, setDefaultDiscount] = useState('');
  const [defaultLastMinuteDiscount, setDefaultLastMinuteDiscount] = useState('');
  const [discountCollection, setDiscountCollection] = useState([]);

  const defaultDiscountChange = (e) => {
    setDefaultDiscount(e.target.value);
    setDiscountsFormData({ ...discountsFormData, nightsDiscountMapping: { ...discountsFormData.nightsDiscountMapping, default: parseInt(e.target.value) } });
  }

  const defaultLastMinuteDiscountChange = (e) => {
    setDefaultLastMinuteDiscount(e.target.value);
    setDiscountsFormData({ ...discountsFormData, lastMinuteDaysDiscountMapping: { ...discountsFormData.lastMinuteDaysDiscountMapping, default: parseInt(e.target.value) } });
  }

  useEffect(() => {
    getDiscounts();
  }, []);

  const discountChange = (e) => {
    setDiscountsFormData({ ...discountsFormData, [e.target.name]: e.target.value });
  }

  const resetDiscountForm = () => {
    setDiscountsFormData({
      name: '',
      nightsDiscountMapping: {},
      lastMinuteDaysDiscountMapping: {},
    });
    setDefaultDiscount('');
    setDefaultLastMinuteDiscount('');
    setDiscounts([]);
    setLastMinuteDaysDiscount([]);
  };

  const discountSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.API_URL}/discounts`, discountsFormData);
      resetDiscountForm();
      await getDiscounts();
    } catch (error) {
      console.log(error);
    }
  };

  const getDiscounts = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/discounts`);
      console.log(response.data);
      setDiscountCollection(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddDay = () => {
    setDiscounts([...discounts, { day: '', discount: '' }]);
  };

  const handleLastMinuteDaysDiscount = (e) => {
    setLastMinuteDaysDiscount([...lastMinuteDaysDiscount, { day: '', discount: '' }]);
  }

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDiscounts = [...discounts];
    updatedDiscounts[index][name] = value;
    setDiscounts(updatedDiscounts);
    setDiscountsFormData({ ...discountsFormData, nightsDiscountMapping: { ...discountsFormData.nightsDiscountMapping, [updatedDiscounts[index].day]: parseInt(updatedDiscounts[index].discount) } });
  };

  const handlelastMinuteInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDiscounts = [...lastMinuteDaysDiscount];
    updatedDiscounts[index][name] = value;
    setLastMinuteDaysDiscount(updatedDiscounts);
    setDiscountsFormData({ ...discountsFormData, lastMinuteDaysDiscountMapping: { ...discountsFormData.lastMinuteDaysDiscountMapping, [updatedDiscounts[index].day]: parseInt(updatedDiscounts[index].discount) } });
  };

  const handleDeleteDay = (index) => {
    const updatedDiscounts = [...discounts];
    updatedDiscounts.splice(index, 1);
    setDiscounts(updatedDiscounts);
  };

  const handleLastMinDeleteDay = (index) => {
    const updatedDiscounts = [...lastMinuteDaysDiscount];
    updatedDiscounts.splice(index, 1);
    setLastMinuteDaysDiscount(updatedDiscounts);
  };

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
        <Col lg={7} md={12} sm={12}>
          <Card>
            <Card.Body>
              <Accordion defaultActiveKey="0" flush>
                {discountCollection.length > 0 && discountCollection.map((item, index) => (
                  <Accordion.Item key={index} eventKey={index}>
                    <Accordion.Header><strong>{item.id} - {item.name}</strong></Accordion.Header>
                    <Accordion.Body>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Mapping Type</th>
                            <th>Minimum Days</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(item).map((mappingType) => (
                            <Fragment key={mappingType}>
                              {mappingType !== 'id' && mappingType !== 'name' && (
                                <tr>
                                  <td>{mappingType}</td>
                                  {Object.entries(item[mappingType]).map(([key, value]) =>
                                    <td key={key}>
                                      <div>
                                        {key}
                                      </div>
                                    </td>
                                  )}
                                  {Object.entries(item[mappingType]).map(([key, value]) =>
                                    <td key={value}>
                                      <div>
                                        {value}
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              )}
                            </Fragment>
                          ))}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={7} md={12} sm={12}>
          <Card>
            <Card.Body>
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
                <br></br> <br></br>
                {discounts.length >= 1 && (
                  <div>
                    <Form.Group controlId="defaultDiscount">
                      <Form.Label>Default Discount</Form.Label>
                      <Form.Control
                        type="number"
                        name="defaultDiscount"
                        value={defaultDiscount}
                        onChange={defaultDiscountChange}
                        required
                      />
                    </Form.Group>
                  </div>
                )}
                <br></br>
                <h4>Last Minute Discounts Per Night</h4>
                {lastMinuteDaysDiscount.map((discount, index) => (
                  <div key={index}>
                    <Row>
                      <Col>
                        <Form.Group controlId={`day-${index}`}>
                          <Form.Label>Number of Nights</Form.Label>
                          <Form.Control
                            type="number"
                            name="day"
                            value={discount.day}
                            onChange={(event) => handlelastMinuteInputChange(index, event)}
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
                            onChange={(event) => handlelastMinuteInputChange(index, event)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <br></br>
                        <Button variant="danger" onClick={() => handleLastMinDeleteDay(index)}>
                          Delete
                        </Button>
                      </Col>

                    </Row>
                    <br></br>
                  </div>
                ))}
                <br></br>
                <Button variant="primary" onClick={handleLastMinuteDaysDiscount}>
                  Add Last Minute Night Discount
                </Button>
                <br></br> <br></br>
                {lastMinuteDaysDiscount.length >= 1 && (
                  <div>
                    <Form.Group controlId="defaultlastminDiscount">
                      <Form.Label>Default Last Minute Discount</Form.Label>
                      <Form.Control
                        type="number"
                        name="defaullastmintDiscount"
                        value={defaultLastMinuteDiscount}
                        onChange={defaultLastMinuteDiscountChange}
                        required
                      />
                    </Form.Group>
                  </div>
                )}
                <br></br>
                <Button variant="success" type="submit">
                  Submit
                </Button>
              </Form>

              <br></br>
              <Row>
                <Col>
                  <Stack direction="horizontal" gap={2}>

                  </Stack>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Discounts;
