import axios from "axios";

const getOwners = async () => {
    try {
        const response = await axios.get(`${process.env.API_URL}/owner`);
        return response.data;
    } catch (error) {
        console.error('Error getting owners:', error);
    }
}

const addOwner = async (owner) => {
    try {
        const response = await axios.post(`${process.env.API_URL}/owner`, owner);
        return response.data;
    } catch (error) {
        console.error('Error adding owner:', error);
    }
}

export { getOwners, addOwner };