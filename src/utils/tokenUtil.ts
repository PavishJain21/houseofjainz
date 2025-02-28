export const setToken = (token: string, refreshToken: string) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return { ok: false };
  }

  const response = await fetch('https://houseofjainz.com/api/refresh-token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('authToken', data.access);
  }

  return response;
};
