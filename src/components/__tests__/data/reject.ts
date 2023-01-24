import { AxiosError } from 'axios';

export const errorTokenTimeout = function() {
    const axiosError = new AxiosError();
    axiosError.request = {
                response: '{"message": "Время токена истекло"}',
                status: 401
            };
            
    return axiosError;
};
