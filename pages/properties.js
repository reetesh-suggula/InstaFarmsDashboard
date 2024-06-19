// import node module libraries
import { Fragment, useState, useEffect } from 'react';
import { Col, Row, Card, Accordion, Nav, Tab, Container, Form, Button, Table, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import { FormSelect, DropFiles, ErrorToast } from "widgets";
import axios from 'axios';
import { getAreas, getCities, getStates } from 'data/apis/locations';
import { getAmenities } from 'data/apis/amenities';
import { getExtraPlans } from 'data/apis/extraplan';
import { getDiscounts } from 'data/apis/discounts';
import { getCaretakers } from 'data/apis/caretaker';
import { getOwners } from 'data/apis/owners';
import { getCancellationTypes } from 'data/apis/cancellationtype';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { AgGridTable } from 'sub-components';


const PropertyFormModal = ({ show, handleClose, handleSubmit, propertyFormData, handleInputChange, handleDisplayImageChange, handlePropertyImages, handleCheckboxChange, handleChange1, selectedAmenities, amenityStatus, handleFormChange, basePrices, days, cancellationTypes, caretakers, discountPlans, extraPlans, faq, handleFaqChange, handleDeleteFaq, handleAddFaq, owners, states, cities, areas, amenities }) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Property</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter original name"
              id='originalName'
              name='originalName'
              value={propertyFormData.originalName}
              onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Code Name</Form.Label>
            <Form.Control type="text" placeholder="Enter code name"
              id='codeName'
              name='codeName'
              value={propertyFormData.codeName}
              onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Enter Description"
              id='description'
              name='description'
              value={propertyFormData.description}
              onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="mainImage" className="mb-3">
            <Form.Label>Property Main Display Image:</Form.Label>
            <Form.Control type="file"
              onChange={handleDisplayImageChange} />
          </Form.Group>
          <Form.Group controlId="propertyImages" className="mb-3">
            <Form.Label>Property images:</Form.Label>
            <Form.Control type="file" onChange={handlePropertyImages} multiple />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" placeholder="Enter address"
              id="address"
              name="address"
              value={propertyFormData.address}
              onChange={handleInputChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Control
              as={FormSelect}
              placeholder="Select State"
              id="state"
              name="state"
              options={states.map((item) => ({ value: item.id, label: item.name }))}
              onChange={handleInputChange}
              value={propertyFormData.state}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              as={FormSelect}
              placeholder="Select City"
              id="city"
              name="city"
              options={cities.map((item) => ({ value: item.id, label: item.name }))}
              onChange={handleInputChange}
              value={propertyFormData.city}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Area</Form.Label>
            <Form.Control
              as={FormSelect}
              placeholder="Select Area"
              id="area"
              name="area"
              options={areas.map((item) => ({ value: item.id, label: item.name }))}
              onChange={handleInputChange}
              value={propertyFormData.area}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Pincode</Form.Label>
            <Form.Control type="text" placeholder="Enter pincode"
              id='pincode'
              name='pincode'
              value={propertyFormData.pincode}
              onChange={handleInputChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Google Maps Link</Form.Label>
            <Form.Control type="text" placeholder="Enter Map link"
              id='maplink'
              name='maplink'
              value={propertyFormData.maplink}
              onChange={handleInputChange} />
          </Form.Group>

          <h4>Geo Cordinates</h4>
          <Form.Group className="mb-3">
            <Form.Label>Latitude</Form.Label>
            <Form.Control type="text" placeholder="Enter latitude"
              id='latitude'
              name='latitude'
              value={propertyFormData.latitude}
              onChange={handleInputChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Longitude</Form.Label>
            <Form.Control type="text" placeholder="Enter longitude"
              id='longitude'
              name='longitude'
              value={propertyFormData.longitude}
              onChange={handleInputChange} required />
          </Form.Group>

          <Form.Label>Amenities</Form.Label>
          <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel id="demo-multiple-checkbox-label">Amenities</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selectedAmenities}
              onChange={handleChange1}
              input={<OutlinedInput label="amenities" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {amenities.map((name) => (
                <MenuItem key={name.id} value={name.id}>
                  <Checkbox checked={selectedAmenities.indexOf(name.id) > -1} />
                  <ListItemText primary={name.id} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          {selectedAmenities.map((amenity) => (
            <Row key={amenity}>
              <Col>{amenity}</Col>
              <Col>
                <Form.Group key={`${amenity}-USP`} className="mb-3" controlId={`${amenity}-isUSP`}>
                  <Form.Check
                    type="checkbox"
                    label="Is USP"
                    onChange={handleCheckboxChange(amenity, 'isUSP')}
                    checked={amenityStatus[amenity]?.isUSP || false}
                  />
                </Form.Group>
              </Col>
              <Col> <Form.Group key={`${amenity}-paid`} className="mb-3" controlId={`${amenity}-paid`}>
                <Form.Check
                  type="checkbox"
                  label="Paid"
                  onChange={handleCheckboxChange(amenity, 'paid')}
                  checked={amenityStatus[amenity]?.paid || false}
                />
              </Form.Group></Col>
            </Row>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Base Guest Count</Form.Label>
            <Form.Control type="number" placeholder="Enter base guest count"
              id='baseGuestCount'
              name='baseGuestCount'
              value={propertyFormData.baseGuestCount}
              onChange={handleInputChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Max Guest Count</Form.Label>
            <Form.Control type="number" placeholder="Enter max guest count"
              id='maxGuestCount'
              name='maxGuestCount'
              value={propertyFormData.maxGuestCount}
              onChange={handleInputChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Room Count</Form.Label>
            <Form.Control type="number" placeholder="Enter Room Count"
              id='roomCount'
              name='roomCount'
              value={propertyFormData.roomCount}
              onChange={handleInputChange} />
          </Form.Group>

          <Form.Label>Base Prices</Form.Label>
          {days.map((day) => (
            <Row key={day}>
              <Col>{day}</Col>
              <Col>
                <Form.Group className="mb-3" controlId={`${day}-basePrice`}>
                  <Form.Control
                    type="number"
                    placeholder="Enter base price"
                    required
                    onChange={handleFormChange(day)}
                    value={basePrices[day] || ''}
                  />
                </Form.Group>
              </Col>
            </Row>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Cancellation Type ID</Form.Label>
            <Form.Control
              as={FormSelect}
              placeholder="Select Cancellation Type"
              id="cancellationTypeId"
              name="cancellationTypeId"
              options={cancellationTypes.map((item) => ({ value: item.id, label: item.name }))}
              onChange={handleInputChange}
              value={propertyFormData.cancellationTypeId}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Caretaker ID</Form.Label>
            <Form.Control
              as={FormSelect}
              placeholder="Select Caretaker"
              id="caretakerId"
              name="caretakerId"
              options={caretakers.map((item) => ({ value: item.id, label: item.firstname }))}
              onChange={handleInputChange}
              value={propertyFormData.caretakerId}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Discount Plan ID</Form.Label>
            <Form.Control
              as={FormSelect}
              placeholder="Select Discount Plan"
              id="discountPlanId"
              name="discountPlanId"
              options={discountPlans.map((item) => ({ value: item.id, label: item.name }))}
              onChange={handleInputChange}
              value={propertyFormData.discountPlanId}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Extra Plan ID</Form.Label>
            <Form.Control
              as={FormSelect}
              placeholder="Select Extra Plan"
              id="extraPlanID"
              name="extraPlanID"
              options={extraPlans.map((item) => ({ value: item.id, label: item.name }))}
              onChange={handleInputChange}
              value={propertyFormData.extraPlanID}
              required
            />
          </Form.Group>

          <h4>FAQ</h4>
          {faq.map((type, index) => (
            <div key={index}>
              <Row>
                <Col>
                  <Form.Group controlId={`question-${index}`}>
                    <Form.Label>FAQ - {index + 1}</Form.Label>
                    <Form.Control
                      type="text"
                      name="question"
                      value={type.question}
                      onChange={(event) => handleFaqChange(index, event)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId={`answer-${index}`}>
                    <Form.Label>Answer</Form.Label>
                    <Form.Control
                      type="text"
                      name="answer"
                      value={type.answer}
                      onChange={(event) => handleFaqChange(index, event)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <br></br>
                  <Button variant="danger" onClick={() => handleDeleteFaq(index)}>
                    Delete
                  </Button>
                </Col>

              </Row>
              <br></br>
            </div>
          ))}
          <br></br>
          <Button variant="primary" onClick={() => handleAddFaq()}>
            Add One More FAQ
          </Button>

          <Form.Group className="mb-3" >
            <Form.Label>Insta Farms Discount Percentage</Form.Label>
            <Form.Control type="number" placeholder="Enter Insta Farms discount percentage"
              id='instaFarmsDiscountPercenatge'
              name='instaFarmsDiscountPercenatge'
              value={propertyFormData.instaFarmsDiscountPercenatge}
              onChange={handleInputChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Insta Farms Service Fee Percentage</Form.Label>
            <Form.Control type="number" placeholder="Enter Insta Farms service fee percentage"
              id='instaFarmsServiceFeePercentage'
              name='instaFarmsServiceFeePercentage'
              value={propertyFormData.instaFarmsServiceFeePercentage}
              onChange={handleInputChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Owner Discount Percentage</Form.Label>
            <Form.Control type="number" placeholder="Enter owner discount percentage"
              id='ownerDiscountPercenatge'
              name='ownerDiscountPercenatge'
              value={propertyFormData.ownerDiscountPercenatge}
              onChange={handleInputChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Owners</Form.Label>
            <Form.Control
              as={FormSelect}
              placeholder="Select Owner"
              id="ownerId"
              name="ownerId"
              options={owners.map((item) => ({ value: item.id, label: item.firstName }))}
              onChange={handleInputChange}
              value={propertyFormData.ownerID}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>TNC Description</Form.Label>
            <Form.Control type="text" placeholder="Enter TNC details"
              id='tnc'
              name='tnc'
              value={propertyFormData.tnc}
              onChange={handleInputChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Weight</Form.Label>
            <Form.Control type="number" placeholder="Enter weight"
              id='weight'
              name='weight'
              value={propertyFormData.weight}
              onChange={handleInputChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            submit
          </Button>
        </Form>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Submit</Button>
      </Modal.Footer> */}
    </Modal>
  );
};

const Properties = () => {


  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [amenities, setAmenities] = useState([{}]);
  const [extraPlans, setExtraPlans] = useState([]);
  const [discountPlans, setDiscountPlans] = useState([]);
  const [caretakers, setCaretakers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [cancellationTypes, setCancellationTypes] = useState([]);
  const [files, setPropertyFiles] = useState([]);
  const [displayimage, setDisplayImage] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [faq, setFaq] = useState([{}]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    getProperties();
    getAreas().then((data) => setAreas(data));
    getCities().then((data) => setCities(data));
    getStates().then((data) => setStates(data));
    getAmenities().then((data) => {
      setAmenities(data)
    });
    getExtraPlans().then((data) => setExtraPlans(data));
    getDiscounts().then((data) => setDiscountPlans(data));
    getCaretakers().then((data) => setCaretakers(data));
    getOwners().then((data) => { console.log(data); setOwners(data) });
    getCancellationTypes().then((data) => setCancellationTypes(data));
  }, []);

  const [propertyFormData, setPropertyFormData] = useState({
    originalName: '',
    codeName: '',
    description: '',
    address: '',
    state: '',
    city: '',
    area: '',
    pincode: '',
    maplink: '',
    latitude: '',
    longitude: '',
    baseGuestCount: 0,
    maxGuestCount: 0,
    roomCount: 0,
    basePrice: '',
    cancellationTypeId: '',
    caretakerId: '',
    discountPlanId: '',
    extraPlanID: '',
    instaFarmsDiscountPercenatge: 0,
    instaFarmsServiceFeePercentage: 0,
    ownerDiscountPercenatge: 0,
    ownerID: '',
    policy: '',
    tnc: '',
    weight: ''
  });

  const handleInputChange = (e) => {
    setPropertyFormData({ ...propertyFormData, [e.target.id]: e.target.value });
  };

  const handlePropertyImages = (e) => {
    setPropertyFiles(Array.from(e.target.files));
  };

  const handleDisplayImageChange = (e) => {
    setDisplayImage(e.target.files[0]);
  };


  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAmenities(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const [amenityStatus, setAmenityStatus] = useState({});
  const [basePrices, setBasePrices] = useState({});

  const handleFormChange = (day) => (event) => {
    const { value } = event.target;
    setBasePrices(prevState => ({
      ...prevState,
      [day]: value
    }));
  };

  const handleCheckboxChange = (amenity, option) => (event) => {
    setAmenityStatus(prevState => ({
      ...prevState,
      [amenity]: {
        ...prevState[amenity],
        [option]: event.target.checked
      }
    }));
  };

  const handleFaqChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDiscounts = [...faq];
    updatedDiscounts[index][name] = value;
    setFaq(updatedDiscounts);
  };



  const getProperties = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/properties`);
      console.log(response.data);
      setProperties(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(propertyFormData)
    //if (files.length > 0) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    console.log(amenityStatus)
    formData.append('originalName', propertyFormData.originalName);
    formData.append('codeName', propertyFormData.codeName);
    formData.append('description', propertyFormData.description);
    formData.append('address', propertyFormData.address);
    formData.append('state', propertyFormData.state);
    formData.append('city', propertyFormData.city);
    formData.append('area', propertyFormData.area);
    formData.append('pincode', propertyFormData.pincode);
    formData.append('maplink', propertyFormData.maplink);
    formData.append('latitude', propertyFormData.latitude);
    formData.append('longitude', propertyFormData.longitude);
    formData.append('baseGuestCount', propertyFormData.baseGuestCount);
    formData.append('maxGuestCount', propertyFormData.maxGuestCount);
    formData.append('roomCount', propertyFormData.roomCount);
    formData.append('basePrice', basePrices);
    formData.append('cancellationTypeId', propertyFormData.cancellationTypeId);
    formData.append('caretakerId', propertyFormData.caretakerId);
    formData.append('discountPlanId', propertyFormData.discountPlanId);
    formData.append('extraPlanID', propertyFormData.extraPlanID);
    formData.append('instaFarmsDiscountPercenatge', propertyFormData.instaFarmsDiscountPercenatge);
    formData.append('instaFarmsServiceFeePercentage', propertyFormData.instaFarmsServiceFeePercentage);
    formData.append('ownerDiscountPercenatge', propertyFormData.ownerDiscountPercenatge);
    formData.append('ownerID', propertyFormData.ownerID);
    formData.append('policy', propertyFormData.policy);
    formData.append('tnc', propertyFormData.tnc);
    formData.append('weight', propertyFormData.weight);
    formData.append('amenities', selectedAmenities);
    formData.append('options', selectedOptions);
    formData.append('faq', JSON.stringify(faq.map((item) => ({ question: item.question, answer: item.answer }))));
    formData.append('displayimage', displayimage);

    console.log(formData)

    try {

      const response = await axios.post(`${process.env.API_URL}/properties`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
      getProperties();

    } catch (error) {
      console.error('Error uploading files:', error);
    }
    //}
  };

  const resetPropertyForm = () => {
    setPropertyFormData({
      originalName: '',
      codeName: '',
      description: '',
      address: '',
      state: '',
      city: '',
      area: '',
      pincode: '',
      maplink: '',
      latitude: '',
      longitude: '',
      baseGuestCount: 0,
      maxGuestCount: 0,
      roomCount: 0,
      basePrice: '',
      cancellationTypeId: '',
      caretakerId: '',
      discountPlanId: '',
      extraPlanID: '',
      instaFarmsDiscountPercenatge: 0,
      instaFarmsServiceFeePercentage: 0,
      ownerDiscountPercenatge: 0,
      ownerID: '',
      policy: '',
      tnc: '',
      weight: ''
    });
    setPropertyFiles([]);
    setDisplayImage([]);
    setSelectedAmenities([]);
    setSelectedOptions([]);
    setFaq([]);
  };

  const handleAddFaq = () => {
    setFaq([...faq, { question: '', answer: '' }]);
  };

  const handleDeleteFaq = (index) => {
    const updatedFaq = [...faq];
    updatedFaq.splice(index, 1);
    setFaq(updatedFaq);
  };


  const EditButtonRenderer = (params) => {
    const onClick = () => {
        console.log('Edit clicked for row:', params.node.data);
        // Add your edit functionality here
    };

    return <>
    <div onClick={handleShowModal}><i className='fas fa-edit'></i>
    </div> 
    <PropertyFormModal
            show={showModal}
            handleClose={handleCloseModal}
            handleSubmit={handleSubmit}
            propertyFormData={params.node.data}
            handleInputChange={handleInputChange}
            handleDisplayImageChange={handleDisplayImageChange}
            handlePropertyImages={handlePropertyImages}
            handleCheckboxChange={handleCheckboxChange}
            handleChange1={handleChange1}
            selectedAmenities={selectedAmenities}
            amenityStatus={amenityStatus}
            handleFormChange={handleFormChange}
            basePrices={basePrices}
            days={days}
            cancellationTypes={cancellationTypes}
            caretakers={caretakers}
            discountPlans={discountPlans}
            extraPlans={extraPlans}
            faq={faq}
            handleFaqChange={handleFaqChange}
            handleDeleteFaq={handleDeleteFaq}
            handleAddFaq={handleAddFaq}
            owners={owners}
            states={states}
            cities={cities}
            areas={areas}
            amenities={amenities}
          
          // Pass all your form props and handlers here
          />
    </>;
  };

  const ActionButtonRenderer = (params) => {
    return (
      <>
      <DropdownButton id="dropdown-basic-button" title="Actions" size="sm">
        <Dropdown.Item onClick={() => editButtonClick(params.data.id)}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={() => stateDelete(params.data.id)}>Delete</Dropdown.Item>
      </DropdownButton>
      </>
    );
  };

  const columnDefs = [

    { headerName: "Original Name", field: "originalName", sortable: true, filter: true },
    { headerName: "Code Name", field: "codeName", sortable: true, filter: true },
    // { headerName: "Description", field: "description", sortable: true, filter: true },
    // { headerName: "Address", field: "address", sortable: true, filter: true },
    // { headerName: "State", field: "state", sortable: true, filter: true },
    // { headerName: "City", field: "city", sortable: true, filter: true },
    // { headerName: "Area", field: "area", sortable: true, filter: true },
    // { headerName: "Pincode", field: "pincode", sortable: true, filter: true },
    // { headerName: "Maplink", field: "maplink", sortable: true, filter: true },
    // { headerName: "Latitude", field: "latitude", sortable: true, filter: true },
    // { headerName: "Longitude", field: "longitude", sortable: true, filter: true },
    // { headerName: "Base Guest Count", field: "baseGuestCount", sortable: true, filter: true },
    // { headerName: "Max Guest Count", field: "maxGuestCount", sortable: true, filter: true },
    // { headerName: "Room Count", field: "roomCount", sortable: true, filter: true },
    // { headerName: "Base Price", field: "basePrice", sortable: true, filter: true },
    // { headerName: "Cancellation Type ID", field: "cancellationTypeId", sortable: true, filter: true },
    // { headerName: "Caretaker ID", field: "caretakerId", sortable: true, filter: true },
    // { headerName: "Discount Plan ID", field: "discountPlanId", sortable: true, filter: true },
    // { headerName: "Extra Plan ID", field: "extraPlanID", sortable: true, filter: true },
    // { headerName: "Insta Farms Discount Percentage", field: "instaFarmsDiscountPercenatge", sortable: true, filter: true },
    // { headerName: "Insta Farms Service Fee Percentage", field: "instaFarmsServiceFeePercentage", sortable: true, filter: true },
    // { headerName: "Owner Discount Percentage", field: "ownerDiscountPercenatge", sortable: true, filter: true },
    // { headerName: "Owner ID", field: "ownerID", sortable: true, filter: true },
    // { headerName: "Policy", field: "policy", sortable: true, filter: true },
    // { headerName: "TNC", field: "tnc", sortable: true, filter: true },
    // { headerName: "Weight", field: "weight", sortable: true, filter: true },
    // { headerName: "Amenities", field: "amenities", sortable: true, filter: true },
    // { headerName: "FAQ", field: "faq", sortable: true, filter: true },
    // { headerName: "Display Image", field: "displayImage", sortable: true, filter: true },
    // { headerName: "Property Images", field: "images", sortable: true, filter: true },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: ActionButtonRenderer,
    },
  ];


  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-0 h2 fw-bold">Properties</h1>
            </div>

          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} style={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="primary" onClick={handleShowModal}>Add New Property</Button>
          <PropertyFormModal
            show={showModal}
            handleClose={handleCloseModal}
            handleSubmit={handleSubmit}
            propertyFormData={propertyFormData}
            handleInputChange={handleInputChange}
            handleDisplayImageChange={handleDisplayImageChange}
            handlePropertyImages={handlePropertyImages}
            handleCheckboxChange={handleCheckboxChange}
            handleChange1={handleChange1}
            selectedAmenities={selectedAmenities}
            amenityStatus={amenityStatus}
            handleFormChange={handleFormChange}
            basePrices={basePrices}
            days={days}
            cancellationTypes={cancellationTypes}
            caretakers={caretakers}
            discountPlans={discountPlans}
            extraPlans={extraPlans}
            faq={faq}
            handleFaqChange={handleFaqChange}
            handleDeleteFaq={handleDeleteFaq}
            handleAddFaq={handleAddFaq}
            owners={owners}
            states={states}
            cities={cities}
            areas={areas}
            amenities={amenities}
          
          // Pass all your form props and handlers here
          />
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Card>
            <Card.Body>
              <AgGridTable columnDefs={columnDefs} rowData={properties} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Properties;
