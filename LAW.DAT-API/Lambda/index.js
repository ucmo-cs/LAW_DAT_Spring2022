import { config } from 'dotenv';
import { API_Handler } from './src/crudService';

export const handler = async(event) => {
    config();
    return await API_Handler(event);
}

