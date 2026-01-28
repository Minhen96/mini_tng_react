import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8088/api', // Clean base URL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// To catch errors globally or attach tokens automatically later
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors like 401 Unauthorized
        return Promise.reject(error);
    }
);

export default apiClient;