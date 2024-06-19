// import node module libraries
import { Fragment, use, useEffect } from 'react';
import { Col, Row, Card, Accordion, Nav, Tab, Container, Form, Button, Table } from 'react-bootstrap';
import { FormSelect, DropFiles, ErrorToast } from "widgets";
import { useState } from 'react';
import axios from 'axios';


const Locations = () => {

  const [stateFormData, setStateFormData] = useState({
    state: ''
  });
  const [stateCityFormData, setStateCityFormData] = useState({
    stateId: '',
    city: ''
  });
  const [areaFormData, setAreaFormData] = useState({
    cityId: '',
    area: '',
    weight: 0
  });
  const [stateCityIdMap, setStateCityIdMapData] = useState([]);
  const [cityAreasIdMap, setCityAreasIdMapData] = useState([]);
  const [AreasMap, setAreasMapData] = useState([]);


  const [errorMessage, setErrorMessage] = useState('');
  const [stateCityData, setStateCityData] = useState([]);
  const [cityAreaData, setCityAreaData] = useState([]);



  useEffect(() => {
    getstates();
    getCities();
    getAreas();
  }, []);

  useEffect(() => {
    createStateCityData();
    createCityAreaData();
  }, [stateCityIdMap, cityAreasIdMap, AreasMap])

  const createStateCityData = () => {
    setStateCityData(stateCityIdMap.map((item) => ({ state: item.name, stateId: item.id, cities: cityAreasIdMap.filter((city) => item.cityIds.includes(city.id)) })));
  }

  const createCityAreaData = () => {
    setCityAreaData(cityAreasIdMap.map((item) => ({ city: item.name, cityId: item.id, areas: AreasMap.filter((area) => item.areaIds.includes(area.id)) })));
  }

  const stateChange = (e) => {
    setStateFormData({ ...stateFormData, [e.target.name]: e.target.value.toLowerCase() });
  };

  const stateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.API_URL}/locations/states`, stateFormData);
      await getstates();
      stateReset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error);
      stateReset();
    }
  };

  const stateReset = () => {
    setStateFormData({ state: '' });
  };

  const getstates = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/locations/states`);
      setStateCityIdMapData(response.data)
    } catch (error) {
      console.error('Error getting states:', error);
      setErrorMessage(error);
    }
  };

  const deleteState = async (id) => {
    try {
      const response = await axios.delete(`${process.env.API_URL}/locations/states/${id}`);
      await getstates();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error);
    }
  }

  const cityChange = (e) => {
    setStateCityFormData({ ...stateCityFormData, [e.target.name]: e.target.value });
  };

  const stateCitySubmit = async (e) => {
    e.preventDefault();
    try {
      if (stateCityFormData.stateId !== '' && stateCityFormData.city !== '') {
        const response = await axios.post(`${process.env.API_URL}/locations/cities`, stateCityFormData);
        await getCities();
        await getstates();
        stateCityReset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error);
      stateCityReset();
    }
  };

  const stateCityReset = () => {
    setStateCityFormData({ stateId: '', city: '' });
  };

  const getCities = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/locations/cities`);
      console.log(response.data)
      setCityAreasIdMapData(response.data)
    } catch (error) {
      console.error('Error getting states:', error);
      setErrorMessage('Error occurred while fetching data from the API.');
    }
  };

  const deleteCities = async (cityid, stateid) => {
    try {
      const response = await axios.delete(`${process.env.API_URL}/locations/cities`, { data: { cityId: cityid, stateId: stateid } });
      await getCities();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Error occurred while fetching data from the API.');
    }
  }

  const areaChange = (e) => {
    setAreaFormData({ ...areaFormData, [e.target.name]: e.target.value });
  };

  const areaCityIdSubmit = async (e) => {
    e.preventDefault();
    try {
      if (areaFormData.cityId !== '' && areaFormData.area !== '') {
        const response = await axios.post(`${process.env.API_URL}/locations/areas`, areaFormData);
        await getAreas();
        await getCities();
        await getstates();
        cityAreaReset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error);
      stateCityReset();
    }
  };

  const cityAreaReset = () => {
    setAreaFormData({ cityId: '', area: '', weight: 0 });
  };

  const getAreas = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/locations/areas`);
      console.log(response.data)
      setAreasMapData(response.data)
    } catch (error) {
      console.error('Error getting states:', error);
      setErrorMessage('Error occurred while fetching data from the API.');
    }
  };

  const deleteAreas = async (cityid, area) => {
    try {
      const response = await axios.delete(`${process.env.API_URL}/locations/areas`, { data: { cityId: cityid, area: area } });
      await getAreas();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Error occurred while fetching data from the API.');
    }
  }

  return (
    <Container fluid className="p-6">
      {errorMessage.length > 0 && <ErrorToast errorMessage={errorMessage} />}
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Locations</h1>
            </div>
          </div>
        </Col>
      </Row>

      {/*  basic  */}
      <Row>
        <Col xl={12} lg={12} md={12} sm={12}>
          <Tab.Container defaultActiveKey="all">
            <Card>
              <Card.Header className="border-bottom-0 p-0 ">
                <Nav className="nav-lb-tab">
                  <Nav.Item>
                    <Nav.Link eventKey="states" className="mb-sm-3 mb-md-0">
                      States
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="cities" className="mb-sm-3 mb-md-0">
                      Cities
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="areas" className="mb-sm-3 mb-md-0">
                      Areas
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body className="p-0">
                <Tab.Content>
                  <Tab.Pane eventKey="states" className="pb-4 p-4">
                    <Row className="mb-3">
                      <Row className="mb-3">
                        <Form onSubmit={stateSubmit}>
                          <Form.Label className="col-sm-2" htmlFor="state">
                            <strong>State:</strong>
                          </Form.Label>
                          <Col md={8} xs={10}>
                            <Form.Control
                              type="text"
                              placeholder="Enter State"
                              id="state"
                              name="state"
                              value={stateFormData.state}
                              onChange={stateChange}
                              required
                            />
                          </Col>
                          <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                            <Button variant="primary" size="sm" type="submit">
                              Save
                            </Button>
                          </Col>
                        </Form>
                      </Row>
                    </Row>
                    <Table className="text-nowrap">
                      <thead>
                        <tr>
                          <th scope="col">State Name</th>
                          <th scope="col">#</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          stateCityIdMap.length > 0 && stateCityIdMap.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td>  <Button variant="danger" size="sm" onClick={() => deleteState(item.id)}>
                                Delete
                              </Button></td>

                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </Tab.Pane>

                  <Tab.Pane eventKey="cities" className="pb-4 p-4 react-code">
                    <Form onSubmit={stateCitySubmit}>
                      <Col md={8} xs={12}>
                        <Form.Label className="col-sm-4" htmlFor="stateId">
                          <strong>State:</strong>
                        </Form.Label>
                        <Form.Control
                          as={FormSelect}
                          placeholder="Select State"
                          id="stateId"
                          name="stateId"
                          options={stateCityIdMap.map((item) => ({ value: item.id, label: item.name }))}
                          onChange={cityChange}
                          value={stateCityFormData.stateId}
                          required
                        />
                      </Col>
                      <br></br>
                      <Col md={8} xs={10}>
                        <Form.Label className="col-sm-2" htmlFor="city">
                          <strong>City:</strong>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter city"
                          id="city"
                          name="city"
                          value={stateCityFormData.city}
                          onChange={cityChange}
                          required
                        />
                      </Col>
                      <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                        <Button variant="primary" size="sm" type="submit">
                          Save
                        </Button>
                      </Col>
                    </Form>
                    <br /><br />
                    <Col>
                      <Accordion defaultActiveKey="0" flush>
                        {stateCityData.length > 0 && stateCityData.map((item, index) => (
                          <Accordion.Item key={index} eventKey={index}>
                            <Accordion.Header><strong>{item.state}</strong></Accordion.Header>
                            <Accordion.Body>
                              <Table className="text-nowrap">
                                <thead>
                                  <tr>
                                    <th scope="col">City Name</th>
                                    <th scope="col">#</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.cities.map((city, cityIndex) => (
                                    <tr key={cityIndex}>
                                      <td>{city.name}</td>
                                      <td>  <Button variant="danger" size="sm" onClick={() => deleteCities(city.id, item.stateId)}>
                                        Delete
                                      </Button></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    </Col>
                  </Tab.Pane>
                  <Tab.Pane eventKey="areas" className="pb-4 p-4 react-code">
                    <Form onSubmit={areaCityIdSubmit}>
                      <Col md={8} xs={12}>
                        <Form.Label className="col-sm-4" htmlFor="cityId">
                          <strong>City:</strong>
                        </Form.Label>
                        <Form.Control
                          as={FormSelect}
                          placeholder="Select City"
                          id="cityId"
                          name="cityId"
                          options={cityAreasIdMap.map((item) => ({ value: item.id, label: item.name }))}
                          onChange={areaChange}
                          value={areaFormData.cityId}
                          required
                        />
                      </Col>
                      <br></br>
                      <Col md={8} xs={10}>
                        <Form.Label className="col-sm-2" htmlFor="area">
                          <strong>Area:</strong>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter area"
                          id="area"
                          name="area"
                          value={areaFormData.area}
                          onChange={areaChange}
                          required
                        />
                      </Col>
                      <br></br>
                      <Col md={8} xs={10}>
                        <Form.Label className="col-sm-2" htmlFor="weight">
                          <strong>Weight:</strong>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter weight"
                          id="weight"
                          name="weight"
                          value={areaFormData.weight}
                          onChange={areaChange}
                          required
                        />
                      </Col>
                      <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                        <Button variant="primary" size="sm" type="submit">
                          Save
                        </Button>
                      </Col>
                    </Form>
                    <br /><br />
                    <Col>
                      <Accordion defaultActiveKey="0" flush>
                        {cityAreaData.length > 0 && cityAreaData.map((item, index) => (
                          <Accordion.Item key={index} eventKey={index}>
                            <Accordion.Header><strong>{item.city}</strong></Accordion.Header>
                            <Accordion.Body>
                              <Table className="text-nowrap">
                                <thead>
                                  <tr>
                                    <th scope="col">Area Name</th>
                                    <th scope="col">#</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.areas.map((area, areaIndex) => (
                                    <tr key={areaIndex}>
                                      <td>{area.name}</td>
                                      <td>  <Button variant="danger" size="sm" onClick={() => deleteCities(area.id, item.cityId)}>
                                        Delete
                                      </Button></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>  
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    </Col>

                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
      {/* end of basic */}
    </Container>
  );
};

export default Locations;
