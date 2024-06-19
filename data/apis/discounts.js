import axios from "axios";

const getDiscounts = async () => {
    try {
        const response = await axios.get(`${process.env.API_URL}/discounts`);
        return response.data;
    } catch (error) {
        console.error('Error getting discounts:', error);
    }
}

const addDiscount = async (discount) => {
    try {
        const response = await axios.post(`${process.env.API_URL}/discounts`, discount);
        return response.data;
    } catch (error) {
        console.error('Error adding discount:', error);
    }
}


export { getDiscounts, addDiscount };