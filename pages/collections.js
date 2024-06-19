// import node module libraries
import { Fragment, useState, useEffect } from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { Accordion, Nav, Tab, Form, Button, Table, Badge, Stack } from 'react-bootstrap';
import axios from 'axios';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { getCollection, postCollection } from 'data/apis/collections';
import { getProperties } from 'data/apis/properties';

const Collections = () => {

    useEffect(() => {
        getProperties().then((data) => {
            setProperties(data);
        });
        getCollection().then((data) => {
            setCollections(data);
        });
    }
    , []);

    const [properties, setProperties] = useState([]);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [collections, setCollections] = useState([]);
    const [collection, setCollection] = useState({
        name: '',
        properties: [],
        displayImage: '',
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        const collection = {
            properties: selectedProperties,
            displayImage: e.target.fileUpload.files[0],
        }
        await postCollection(collection);
    };

    const handleChange1 = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedProperties(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

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
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-0 h2 fw-bold">Collections</h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={7} md={12} sm={12}>
          <Card>
            <Card.Body>
           
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={7} md={12} sm={12}>
          <Card>
            <Card.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="collectionName">
                    <Form.Label>Collection Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Collection Name" />
                </Form.Group>

                <Form.Group controlId="fileUpload">
                    <Form.Label>Upload File</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>

                
                <FormControl sx={{ m: 1, width: '100%' }}>
                  <InputLabel id="demo-multiple-checkbox-label">Properties</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedProperties}
                    onChange={handleChange1}
                    input={<OutlinedInput label="properties" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {properties.map((property) => (
                      <MenuItem key={property.id} value={property.id} >
                        <Checkbox checked={selectedProperties.indexOf(property.originalName) > -1} />
                        <ListItemText primary={property.originalName} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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

export default Collections;
