import axios from "axios";

const getProperties = async () => {
    try {
        const response = await axios.get(`${process.env.API_URL}/properties`);
        return response.data;
    } catch (error) {
        console.error('Error getting properties:', error);
    }
}

const addProperty = async (property) => {
    try {
        const response = await axios.post(`${process.env.API_URL}/properties`, property);
        return response.data;
    } catch (error) {
        console.error('Error adding property:', error);
    }
}


export { getProperties, addProperty };