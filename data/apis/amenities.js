import axios from "axios";

const getAmenities = async () => {
    try {
        const response = await axios.get(`${process.env.API_URL}/amenities`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export { getAmenities };