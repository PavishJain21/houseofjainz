import { refreshAccessToken } from '../utils/tokenUtil';

const BASE_URL = 'https://houseofjainz.com/api';

const authMiddleware = async (endpoint: string, options: RequestInit) => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, options);

    if (response.status === 401) {
        // Try to refresh the token
        const refreshResponse = await refreshAccessToken();

        if (refreshResponse.ok) {
            // Retry the original request with the new token
            const newOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            };
            return fetch(url, newOptions);
        }
    }

    return response;
};

export default authMiddleware;
