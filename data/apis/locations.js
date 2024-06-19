import axios from "axios";



const getStates = async () => {
    try {
        const response = await axios.get(`${process.env.API_URL}/locations/states`);
        return response.data;
    } catch (error) {
        console.error('Error getting states:', error);
    }
};

const addState = async (state) => {
    try {
        const response = await axios.post(`${process.env.API_URL}/locations/states`, state);
        return response.data;
    } catch (error) {
        console.error('Error adding state:', error);
    }
};

const deleteState = async (id) => {
    try {
        const response = await axios.delete(`${process.env.API_URL}/locations/states/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting state:', error);
    }
};

const updateState = async (state) => {
    try {
        const response = await axios.put(`${process.env.API_URL}/locations/states/${state.id}`, state);
        return response.data;
    } catch (error) {
        console.error('Error updating state:', error);
    }
};

const getCities = async () => {
    try {
        const response = await axios.get(`${process.env.API_URL}/locations/cities`);
        return response.data;
    } catch (error) {
        console.error('Error getting cities:', error);
    }
};

const updateCity = async (city) => {
    try {
        const response = await axios.put(`${process.env.API_URL}/locations/cities/${city.cityId}`, city);
        return response.data;
    } catch (error) {
        console.error('Error updating city:', error);
    }
};

const deleteCity = async (city) => {
    try {
        const response = await axios.delete(`${process.env.API_URL}/locations/cities`, {data:city});
        return response.data;
    } catch (error) {
        console.error('Error deleting city:', error);
    }
};

const addCity = async (city) => {
    try {
        const response = await axios.post(`${process.env.API_URL}/locations/cities`, city);
        return response.data;
    } catch (error) {
        console.error('Error adding city:', error);
    }
};


const getAreas = async () => {
    try {
        const response = await axios.get(`${process.env.API_URL}/locations/areas`);
        return response.data;
    } catch (error) {
        console.error('Error getting states:', error);
    }
};

const addArea = async (area) => {
    try {
        const response = await axios.post(`${process.env.API_URL}/locations/areas`, area);
        return response.data;
    } catch (error) {
        console.error('Error adding area:', error);
    }
}

const updateArea = async (area) => {
    try {
        const response = await axios.put(`${process.env.API_URL}/locations/areas/${area.areaId}`, area);
        return response.data;
    } catch (error) {
        console.error('Error updating area:', error);
    }
}

const deleteArea = async (area) => {
    try {
        const response = await axios.delete(`${process.env.API_URL}/locations/areas`, {data:area});
        return response.data;
    } catch (error) {
        console.error('Error deleting area:', error);
    }
}

export { getCities, getStates, getAreas, deleteState, addState, updateState, addCity, updateCity, deleteCity, addArea, updateArea, deleteArea};