// import node module libraries
import { Fragment, useState, useEffect } from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { Accordion, Nav, Tab, Form, Button, Table, Badge, Stack } from 'react-bootstrap';
import axios from 'axios';
import { AgGridTable } from 'sub-components';

const CancellationTypes = () => {
  const [cancellationTypeData, setCancellationTypeFormData] = useState({
    name: '',
    firmMinDaysMapping: {},
    moderateMinDaysMapping: {},
    strictMinDaysMapping: {},
    flexibleMinDaysMapping: {},
  });

  const columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'firmMinDaysMapping', field: 'firmMinDaysMapping', cellRenderer: (params) => {
      return renderMinMapping(params, 'firm');  }, wrapText: true,
      autoHeight: true },
    { headerName: 'moderateMinDaysMapping', field: 'moderateMinDaysMapping',  cellRenderer: (params) => {
      return renderMinMapping(params, 'moderate');  }, wrapText: true,
      autoHeight: true, },
    { headerName: 'strictMinDaysMapping', field: 'strictMinDaysMapping',  cellRenderer: (params) => {
      return renderMinMapping(params, 'strict');  }, wrapText: true,
      autoHeight: true, },
    { headerName: 'flexibleMinDaysMapping', field: 'flexibleMinDaysMapping',  cellRenderer: (params) => {
      return renderMinMapping(params, 'flexible');  }, wrapText: true,
      autoHeight: true, },
  ];

  const renderMinMapping = (params, type) => {
    const mapping = params.data[`${type}MinDaysMapping`] || {};
    console.log('params');
    console.log(mapping);
    return (
      <Table className="text-nowrap">
        <thead>
          <tr>
            <th>Days</th>
            <th>Percent</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(mapping).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };



    

  const [cancellationTypes, setCancellationTypes] = useState([]);

  const [firmMinDaysMapping, setFirmMinMapping] = useState([]);
  const [moderateMinDaysMapping, setModerateMinDaysMapping] = useState([]);
  const [strictMinDaysMapping, setStrictMinMapping] = useState([]);
  const [flexibleMinDaysMapping, setFlexibleMindaysMapping] = useState([]);

  useEffect(() => {
    getCancellationTypes();
  }
    , []);

  const getCancellationTypes = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/cancellationTypes`);
      console.log(response.data)
      setCancellationTypes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cancellationTypeChange = (e) => {
    setCancellationTypeFormData({ ...cancellationTypeData, [e.target.name]: e.target.value });
  };

  const handleAddDay = (type) => {
    if (type === 'firm') {
      setFirmMinMapping([...firmMinDaysMapping, { day: '', percent: '' }]);
    } else if (type === 'moderate') {
      setModerateMinDaysMapping([...moderateMinDaysMapping, { day: '', percent: '' }]);
    } else if (type === 'strict') {
      setStrictMinMapping([...strictMinDaysMapping, { day: '', percent: '' }]);
    } else if (type === 'flexible') {
      setFlexibleMindaysMapping([...flexibleMinDaysMapping, { day: '', percent: '' }]);
    }
  };

  const handleDeleteDay = (index, type) => {
    if (type === 'firm') {
      const updatedDiscounts = [...firmMinDaysMapping];
      updatedDiscounts.splice(index, 1);
      setFirmMinMapping(updatedDiscounts);
    } else if (type === 'moderate') {
      const updatedDiscounts = [...moderateMinDaysMapping];
      updatedDiscounts.splice(index, 1);
      setModerateMinDaysMapping(updatedDiscounts);
    } else if (type === 'strict') {
      const updatedDiscounts = [...strictMinDaysMapping];
      updatedDiscounts.splice(index, 1);
      setStrictMinMapping(updatedDiscounts);
    } else if (type === 'flexible') {
      const updatedDiscounts = [...flexibleMinDaysMapping];
      updatedDiscounts.splice(index, 1);
      setFlexibleMindaysMapping(updatedDiscounts);
    }
  };

  const handleInputChange = (index, event, type) => {
    if (type === 'firm') {
      const { name, value } = event.target;
      const updatedDiscounts = [...firmMinDaysMapping];
      updatedDiscounts[index][name] = value;
      setFirmMinMapping(updatedDiscounts);
      setCancellationTypeFormData({ ...cancellationTypeData, firmMinDaysMapping: { ...cancellationTypeData.firmMinDaysMapping, [updatedDiscounts[index].day]: parseInt(updatedDiscounts[index].percent) } });
    } else if (type === 'moderate') {
      const { name, value } = event.target;
      const updatedDiscounts = [...moderateMinDaysMapping];
      updatedDiscounts[index][name] = value;
      setModerateMinDaysMapping(updatedDiscounts);
      setCancellationTypeFormData({ ...cancellationTypeData, moderateMinDaysMapping: { ...cancellationTypeData.moderateMinDaysMapping, [updatedDiscounts[index].day]: parseInt(updatedDiscounts[index].percent) } });
    } else if (type === 'strict') {
      const { name, value } = event.target;
      const updatedDiscounts = [...strictMinDaysMapping];
      updatedDiscounts[index][name] = value;
      setStrictMinMapping(updatedDiscounts);
      setCancellationTypeFormData({ ...cancellationTypeData, strictMinDaysMapping: { ...cancellationTypeData.strictMinDaysMapping, [updatedDiscounts[index].day]: parseInt(updatedDiscounts[index].percent) } });
    } else if (type === 'flexible') {
      const { name, value } = event.target;
      const updatedDiscounts = [...flexibleMinDaysMapping];
      updatedDiscounts[index][name] = value;
      setFlexibleMindaysMapping(updatedDiscounts);
      setCancellationTypeFormData({ ...cancellationTypeData, flexibleMinDaysMapping: { ...cancellationTypeData.flexibleMinDaysMapping, [updatedDiscounts[index].day]: parseInt(updatedDiscounts[index].percent) } });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      console.log(cancellationTypeData);
      const response = await axios.post(`${process.env.API_URL}/cancellationTypes`, cancellationTypeData);
      resetCancellationTypeForm();
      await getCancellationTypes();
    } catch (error) {
      console.log(error);
    }
  }

  const resetCancellationTypeForm = () => {
    setCancellationTypeFormData({
      name: '',
      firmMinDaysMapping: {},
      moderateMinDaysMapping: {},
      strictMinDaysMapping: {},
      flexibleMinDaysMapping: {}
    });
    setFirmMinMapping([]);
    setModerateMinDaysMapping([]);
    setStrictMinMapping([]);
    setFlexibleMindaysMapping([]);
  }


  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-0 h2 fw-bold">Cancellation Type</h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <AgGridTable columnDefs={columnDefs} rowData={cancellationTypes} />
          {/* <Card>
            <Card.Body>
              <Accordion defaultActiveKey="0" flush>
                {cancellationTypes.length > 0 && cancellationTypes.map((item, index) => (
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
          </Card> */}
        </Col>
      </Row>
      <Row>
        <Col lg={7} md={12} sm={12}>
          <Card>
            <Card.Body>
              <Form onSubmit={submit} >
                <Form.Label className="col-sm-2" htmlFor="name">
                  <strong>Name:</strong>
                </Form.Label>
                <Col md={8} xs={10}>
                  <Form.Control
                    type="text"
                    placeholder="Enter Cancellation Type Name"
                    id="name"
                    name="name"
                    value={cancellationTypeData.name}
                    onChange={cancellationTypeChange}
                    required
                  />
                </Col>
                <br></br>

                <h4>Firm CancellationType</h4>
                {firmMinDaysMapping.map((type, index) => (
                  <div key={index}>
                    <Row>
                      <Col>
                        <Form.Group controlId={`day-${index}`}>
                          <Form.Label>Number of Nights</Form.Label>
                          <Form.Control
                            type="number"
                            name="day"
                            value={type.day}
                            onChange={(event) => handleInputChange(index, event, 'firm')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId={`type-${index}`}>
                          <Form.Label>Refund Percentage</Form.Label>
                          <Form.Control
                            type="number"
                            name="percent"
                            value={type.percent}
                            onChange={(event) => handleInputChange(index, event, 'firm')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <br></br>
                        <Button variant="danger" onClick={() => handleDeleteDay(index, 'firm')}>
                          Delete
                        </Button>
                      </Col>

                    </Row>
                    <br></br>
                  </div>
                ))}
                <br></br>
                <Button variant="primary" onClick={() => handleAddDay('firm')}>
                  Add Firm Type Cancellation Mapping
                </Button>
                <br></br>
                <br></br>
                <h4>Moderate CancellationType</h4>
                {moderateMinDaysMapping.map((type, index) => (
                  <div key={index}>
                    <Row>
                      <Col>
                        <Form.Group controlId={`day-${index}`}>
                          <Form.Label>Number of Nights</Form.Label>
                          <Form.Control
                            type="number"
                            name="day"
                            value={type.day}
                            onChange={(event) => handleInputChange(index, event, 'moderate')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId={`type-${index}`}>
                          <Form.Label>Refund Percentage</Form.Label>
                          <Form.Control
                            type="number"
                            name="percent"
                            value={type.percent}
                            onChange={(event) => handleInputChange(index, event, 'moderate')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <br></br>
                        <Button variant="danger" onClick={() => handleDeleteDay(index, 'moderate')}>
                          Delete
                        </Button>
                      </Col>

                    </Row>
                    <br></br>
                  </div>
                ))}
                <br></br>

                <Button variant="primary" onClick={() => handleAddDay('moderate')}>
                  Add Moderate Type Cancellation Mapping
                </Button>
                <br></br>
                <br></br>
                <h4>Strict CancellationType</h4>
                {strictMinDaysMapping.map((type, index) => (
                  <div key={index}>
                    <Row>
                      <Col>
                        <Form.Group controlId={`day-${index}`}>
                          <Form.Label>Number of Nights</Form.Label>
                          <Form.Control
                            type="number"
                            name="day"
                            value={type.day}
                            onChange={(event) => handleInputChange(index, event, 'strict')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId={`type-${index}`}>
                          <Form.Label>Refund Percentage</Form.Label>
                          <Form.Control
                            type="number"
                            name="percent"
                            value={type.percent}
                            onChange={(event) => handleInputChange(index, event, 'strict')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <br></br>
                        <Button variant="danger" onClick={() => handleDeleteDay(index, 'strict')}>
                          Delete
                        </Button>
                      </Col>

                    </Row>
                    <br></br>
                  </div>
                ))}
                <br></br>
                <Button variant="primary" onClick={() => handleAddDay('strict')}>
                  Add Strict Type Cancellation Mapping
                </Button>
                <br></br>
                <br></br>
                <h4>Flexible CancellationType</h4>
                {flexibleMinDaysMapping.map((type, index) => (
                  <div key={index}>
                    <Row>
                      <Col>
                        <Form.Group controlId={`day-${index}`}>
                          <Form.Label>Number of Nights</Form.Label>
                          <Form.Control
                            type="number"
                            name="day"
                            value={type.day}
                            onChange={(event) => handleInputChange(index, event, 'flexible')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId={`type-${index}`}>
                          <Form.Label>Refund Percentage</Form.Label>
                          <Form.Control
                            type="number"
                            name="percent"
                            value={type.percent}
                            onChange={(event) => handleInputChange(index, event, 'flexible')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <br></br>
                        <Button variant="danger" onClick={() => handleDeleteDay(index, 'flexible')}>
                          Delete
                        </Button>
                      </Col>

                    </Row>
                    <br></br>
                  </div>
                ))}
                <br></br>
                <Button variant="primary" onClick={() => handleAddDay('flexible')}>
                  Add Flexible Type Cancellation Mapping
                </Button>

                <br></br>
                <br></br>
                <Button variant="success" type="submit">
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

export default CancellationTypes;
