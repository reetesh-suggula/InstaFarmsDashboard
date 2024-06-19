import { useEffect } from 'react';
import { Col, Row, Card, Tab, Container, Form, Button, DropdownButton, Dropdown, Modal } from 'react-bootstrap';
import { FormSelect, ErrorToast } from "widgets";
import { useState } from 'react';
import axios from 'axios';
import { AgGridTable } from 'sub-components';
import { addCity, updateCity, deleteCity, getCities, getStates } from 'data/apis/locations';


const CitiesFormModal = ({ mode, show, handleClose, editCityFormData, states }) => {

  const [cityFormData, setCityFormData] = useState({ cityId: '', stateId: '', city: '', state: '' });

  useEffect(() => {
    if (mode == 'edit') {
      setCityFormData(editCityFormData);
    }
  }, [editCityFormData, mode]);

  const citySubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode == 'add' && cityFormData.stateId && cityFormData.city && cityFormData.city.length > 0) {
        const response = await addCity(cityFormData);
      }
      if (mode == 'edit' && cityFormData.stateId && cityFormData.city && cityFormData.city.length > 0) {
        const response = await updateCity(cityFormData);
      }
      cityReset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const cityReset = () => {
    setCityFormData({ name: '', id: '', state: '' });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title> {mode == 'add' ? 'Add City' : 'Edit City'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Label className="col-sm-4" htmlFor="stateId">
            <strong>State:</strong>
          </Form.Label>
          <Form.Control
            as={FormSelect}
            placeholder="Select State"
            options={states.map((item) => ({ value: item.id, label: item.name }))}
            onChange={(e) => { setCityFormData({ ...cityFormData, stateId: e.target.value }) }}
            selectedValue={cityFormData.stateId}
            disabled={mode == 'edit'}
            required
          />
          <br></br>
          <Form.Label className="col-sm-2" htmlFor="city">
            <strong>City:</strong>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={cityFormData.city}
            onChange={(e) => setCityFormData({ ...cityFormData, city: e.target.value })}
            required
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant='primary' type="submit" onClick={citySubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


const Cities = () => {
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [mode, setMode] = useState();
  const [states, setStates] = useState([]);
  const [stateCityData, setStateCityData] = useState([]);

  const createStateCityData = async () => {
    try {
      let stateCityData = [];
      getCities().then((data) => {
        return data;
      }).then((cityData) => {
        getStates().then((data) => {
          setStates(data);
          data.forEach((state) => {
            state.cityIds.forEach((cityId) => {
              let city = cityData.find((city) => city.id === cityId);
              if (city) {
                stateCityData.push({ cityId: city.id, stateId: state.id, state: state.name, city: city.name });
              }
            });
          });
          setStateCityData(stateCityData);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    createStateCityData();
  }, []);

  const cityDelete = async (cityData) => {
    try {
      const response = await deleteCity(cityData);
      createStateCityData();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error);
    }
  };


  const ActionButtonRenderer = (params) => {
    return (
      <>
        <DropdownButton id="dropdown-basic-button" title="Actions" size="sm">
          <Dropdown.Item onClick={() => editButtonClick(params.data)}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={() => cityDelete(params.data)}>Delete</Dropdown.Item>
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
    createStateCityData();
    setMode('');
  };

  const addButtonClick = () => {
    setMode('add');
    openModal({});
  };

  const editButtonClick = (cityData) => {
    setMode('edit');
    openModal(cityData);
  };

  const columnDefs = [
    {
      headerName: 'State Name',
      field: 'state',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'City Name',
      field: 'city',
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
          <Button variant="primary" onClick={addButtonClick} >Add New City</Button>
        </Col>
      </Row>
      <br></br>

      <Row>
        <Col xl={12} lg={12} md={12} sm={12}>
          <Tab.Container defaultActiveKey="all">
            <Card>
              <Card.Body>
                <AgGridTable columnDefs={columnDefs} rowData={stateCityData} ></AgGridTable>
                <CitiesFormModal
                  mode={mode}
                  show={showModal}
                  handleClose={closeModal}
                  editCityFormData={modalData}
                  states={states}
                />
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Cities;
