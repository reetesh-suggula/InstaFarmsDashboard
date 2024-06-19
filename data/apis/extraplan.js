import axios from "axios";

const getExtraPlans = async () => {
    try {
        const response = await axios.get(`${process.env.API_URL}/extrasplan`);
        return response.data;
    } catch (error) {
        console.error('Error getting extra plans:', error);
    }
}

const addExtraPlan = async (extraPlan) => {
    try {
        const response = await axios.post(`${process.env.API_URL}/extrasplan`, extraPlan);
        return response.data;
    } catch (error) {
        console.error('Error adding extra plan:', error);
    }
}


export { getExtraPlans, addExtraPlan };