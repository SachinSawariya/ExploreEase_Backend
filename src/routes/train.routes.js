import express from 'express';
import axios from 'axios'
import { ApiError } from '../utils/ApiError.js';
const router = express.Router();



router.post('/getTrainOnDate', async (req, res) => {
  const { from, to, date } = req.body;
  try {
    const response = await axios.get(`https://indian-railway-api.cyclic.app/trains/gettrainon?from=${from}&to=${to}&date=${date}`);
    res.json(response.data);

  } catch (error) {
    throw new ApiError(500, "Internal Server Error while fetching train Data", error)
    
  }
});


export default router;