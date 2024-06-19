import { useEffect } from 'react';
import { Col, Row, Card, Tab, Container, Form, Button, DropdownButton, Dropdown, Modal } from 'react-bootstrap';
import { FormSelect, ErrorToast } from "widgets";
import { useState } from 'react';
import axios from 'axios';
import { AgGridTable } from 'sub-components';
import { getCities, getStates, getAreas, addArea, updateArea, deleteArea } from 'data/apis/locations';


const AreasFormModal = ({ mode, show, handleClose, editAreaFormData, states, cities }) => {

  const [areaFormData, setAreaFormData] = useState({ cityId: '', stateId: '', city: '', state: '', areaId: '', area: '' });
  const [cityIds, setCityIds] = useState([]);

  useEffect(() => {
    if (mode == 'edit') {
      setAreaFormData(editAreaFormData);
      setCityIds(states.find((item) => item.id == editAreaFormData.stateId).cityIds);
    }
  }, [editAreaFormData, mode, states]);

  const areaSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode == 'add' && areaFormData.stateId && areaFormData.cityId && areaFormData.area && areaFormData.area.length > 0) {
        const response = await addArea(areaFormData);
        areaReset();
      }
      if (mode == 'edit' && areaFormData.stateId && areaFormData.cityId && areaFormData.area && areaFormData.area.length > 0) {
        const response = await updateArea(areaFormData);
        handleClose();
      }
   
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const areaReset = () => {
    setAreaFormData({ cityId: '', stateId: '', city: '', state: '', areaId: '', area: ''});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title> {mode == 'add' ? 'Add City' : 'Edit City'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Label className="col-sm-4">
            <strong>State:</strong>
          </Form.Label>
          <Form.Control
            as={FormSelect}
            placeholder="Select State"
            options={states && states.map((item) => ({ value: item.id, label: item.name }))}
            onChange={(e) => {  setAreaFormData({ ...areaFormData, stateId: e.target.value }); setCityIds(states.find((item) => item.id == e.target.value).cityIds)}}
            selectedValue={areaFormData.stateId}
            disabled={mode == 'edit'}
            required
          />
          <br></br>
          <Form.Label className="col-sm-4">
            <strong>City:</strong>
          </Form.Label>
          <Form.Control
            as={FormSelect}
            placeholder="Select City"
            options={cities && cityIds && cities.filter((item)=> cityIds.includes(item.id)).map((item) => ({ value: item.id, label: item.name }))}
            onChange={(e) => { setAreaFormData({ ...areaFormData, cityId: e.target.value }) }}
            selectedValue={areaFormData.cityId}
            disabled={mode == 'edit'}
            required
          />
          <br></br>
          <Form.Label className="col-sm-2">
            <strong>Area:</strong>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Area"
            value={areaFormData.area}
            onChange={(e) => setAreaFormData({ ...areaFormData, area: e.target.value })}
            required
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant='primary' type="submit" onClick={areaSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


const Areas = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [mode, setMode] = useState();

  const [stateCityAreaData, setStateCityAreaData] = useState([]);

  const createStateCityAreaData = async () => {
    try {
      let stateCityAreaData = [];
      let cityAreaData = [];
      getAreas().then((data) => {
        return data;
      }).then((areaData) => {
        getCities().then((data) => {
          setCities(data);
          data.forEach((city) => {
            city.areaIds.forEach((areaId) => {
              let area = areaData.find((area) => area.id === areaId);
              if (area) {
                cityAreaData.push({ areaId: area.id, cityId: city.id, city: city.name, area: area.name });
              }
            });
          });
          return cityAreaData;
        }).then((cityAreaData) => {
          getStates().then((data) => {
            setStates(data);
            cityAreaData.forEach((city) => {
              data.forEach((state) => {
                let cityIds = state.cityIds;
                if (cityIds.includes(city.cityId)) {
                  stateCityAreaData.push({ stateId: state.id, state: state.name, ...city });
                }
              });
            });
            setStateCityAreaData(stateCityAreaData);
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    createStateCityAreaData();
  }, []);

  const areaDelete = async (areaData) => {
    try {
      const response = await deleteArea(areaData);
      createStateCityAreaData();
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
          <Dropdown.Item onClick={() => areaDelete(params.data)}>Delete</Dropdown.Item>
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
    createStateCityAreaData();
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
      headerName: 'Area Name',
      field: 'area',
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
              <h1 className="mb-1 h2 fw-bold">Areas</h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} style={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="primary" onClick={addButtonClick} >Add New Area</Button>
        </Col>
      </Row>
      <br></br>

      <Row>
        <Col xl={12} lg={12} md={12} sm={12}>
          <Tab.Container defaultActiveKey="all">
            <Card>
              <Card.Body>
                <AgGridTable columnDefs={columnDefs} rowData={stateCityAreaData} ></AgGridTable>
                <AreasFormModal
                  mode={mode}
                  show={showModal}
                  handleClose={closeModal}
                  editAreaFormData={modalData}
                  states={states}
                  cities={cities}
                />
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Areas;
