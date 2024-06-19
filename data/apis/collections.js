import axios from "axios";

const getCollection = async () => {
    try {
        const response = await axios.get(`${process.env.API_URL}/collections`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const postCollection = async (collection) => {
    try {
        const response = await axios.post(`${process.env.API_URL}/collections`, collection);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export { getCollection, postCollection};