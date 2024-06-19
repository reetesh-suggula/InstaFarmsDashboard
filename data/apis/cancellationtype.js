import axios from "axios";

const getCancellationTypes = async () => {
    try {
        const response = await axios.get(`${process.env.API_URL}/cancellationTypes`);
        return response.data;
    } catch (error) {
        console.error('Error getting cancellation types:', error);
    }
}

const addCancellationType = async (cancellationType) => {
    try {
        const response = await axios.post(`${process.env.API_URL}/cancellationTypes`, cancellationType);
        return response.data;
    } catch (error) {
        console.error('Error adding cancellation type:', error);
    }
}

export { getCancellationTypes, addCancellationType };