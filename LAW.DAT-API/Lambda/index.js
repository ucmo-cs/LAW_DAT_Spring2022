import { config } from 'dotenv';
import { API_Handler } from './src/studentsCrud.js';

export const handler = async(event) => {
    config();
    return await API_Handler(event);
}

