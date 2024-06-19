import axios from "axios";

const getCaretakers = async () => {
    try {
        const response = await axios.get(`${process.env.API_URL}/caretaker`);
        return response.data;
    } catch (error) {
        console.error('Error getting caretakers:', error);
    }
};

const addCaretaker = async (caretaker) => {
    try {
        const response = await axios.post(`${process.env.API_URL}/caretaker`, caretaker);
        return response.data;
    } catch (error) {
        console.error('Error adding caretaker:', error);
    }
};

export { getCaretakers, addCaretaker };