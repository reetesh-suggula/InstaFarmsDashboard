import { Fragment, use, useEffect } from 'react';
import { Col, Row, Card, Container, Form, Button, Tab, Badge, Stack, DropdownButton, Dropdown, Modal } from 'react-bootstrap';
import { FormSelect, DropFiles, ErrorToast } from "widgets";
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Image } from 'next/image';
import { AgGridTable } from 'sub-components';

library.add(fas);


const AmenitiesModal = ({ mode, show, handleClose, editAmenityFormData }) => {

  const [amenityFormData, setAmenityFormData] = useState({ id: '', name: '', iconImage: '' });

  const amenityChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      setAmenityFormData({ ...amenityFormData, [e.target.name]: file });
    } else {
      setAmenityFormData({ ...amenityFormData, [e.target.name]: e.target.value.toLowerCase() });
    }
  };

  useEffect(() => {
    if (mode == 'edit') {
      setAmenityFormData(editAmenityFormData);
    }
  }
    , [editAmenityFormData, mode]
  );

  const amenitySubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode == 'add' && amenityFormData.name && amenityFormData.name.length > 0) {
        const response = await axios.post(`${process.env.API_URL}/amenities`, amenityFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      if (mode == 'edit' && amenityFormData.name && amenityFormData.name.length > 0) {
        const response = await axios.put(`${process.env.API_URL}/amenities/${amenityFormData.id}`, amenityFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      amenityReset();
    }
    catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const amenityReset = () => {
    setAmenityFormData({ id: '', amenity: '', iconImage: '' });
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>

      <Modal.Header closeButton>
        <Modal.Title> {mode == 'add' ? 'Add Amenity' : 'Edit Amenity'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={amenitySubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Amenity Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Amenity Name"
              value={amenityFormData.name}
              name="name"
              id='name'
              onChange={(e) => amenityChange(e)}
              required
              disabled={mode == 'edit'}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amenity Icon</Form.Label>
            <Form.Control
              type="file"
              placeholder="Select Amenity Icon"
              accept='image/*'
              id="iconImage"
              name="iconImage"
              onChange={(e) => amenityChange(e)}
              required
            />
          </Form.Group>
        </Form>
        { mode=='add' && amenityFormData.iconImage && (
          <div>
            <img src={URL.createObjectURL(amenityFormData.iconImage)} alt="Amenity Icon" />
          </div>
        )}
        { mode=='edit' &&  amenityFormData.iconImage  && (
          <div>
            <img src={typeof(amenityFormData.iconImage) === 'string' ? amenityFormData.iconImage : URL.createObjectURL(amenityFormData.iconImage)} alt="Amenity Icon" />
          </div>
        )
        }
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant='primary' type="submit" onClick={amenitySubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};



const Amenities = () => {

  const [amenities, setAmenities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('');
  const [editAmenityFormData, setEditAmenityFormData] = useState({});
  const handleClose = () => {
    setShowModal(false);
    getAmenities();
  };

  useEffect(() => {
    getAmenities();
  }, []);

  const getAmenities = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/amenities`);
      console.log(response.data);
      setAmenities(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const editButtonClick = (data) => {
    setEditAmenityFormData(data);
    setMode('edit');
    setShowModal(true);
  };

  const amenityDelete = async (data) => {
    try {
      const response = await axios.delete(`${process.env.API_URL}/amenities/${data.id}`);
      await getAmenities();
    } catch (error) {
      console.log(error);
    }
  }

  const ImageRenderer = (props) => {

    return (
      <Stack direction="horizontal" className="h-100">
        <img rounded src={props.data.iconImage} className="h-auto w-100" alt="amenity" />
      </Stack>
    );
  };

  const ActionButtonRenderer = (params) => {
    return (
      <>
        <DropdownButton id="dropdown-basic-button" title="Actions" size="sm">
          <Dropdown.Item onClick={() => editButtonClick(params.data)}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={() => amenityDelete(params.data)}>Delete</Dropdown.Item>
        </DropdownButton>
      </>
    );
  };


  const columnDefs = [
    {
      headerName: 'Amenity',
      field: 'name',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Icon',
      field: 'iconImage',
      sortable: true,
      filter: true,
      cellRenderer: ImageRenderer,
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: ActionButtonRenderer,
    },
  ];

  const addButtonClick = () => {
    setMode('add');
    setShowModal(true);
  }

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-0 h2 fw-bold">Amenities</h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} style={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="primary" onClick={addButtonClick} >Add Amenity</Button>
        </Col>
      </Row>
      <Row>
        <Col xl={12} lg={12} md={12} sm={12}>
          <Tab.Container defaultActiveKey="all">
            <Card>
              <Card.Body>
                <AgGridTable columnDefs={columnDefs} rowData={amenities} rowHeight={200} ></AgGridTable>
                <AmenitiesModal mode={mode} show={showModal} handleClose={handleClose} editAmenityFormData={editAmenityFormData} />
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Amenities;
