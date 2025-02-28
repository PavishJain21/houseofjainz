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
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(' https://houseofjainz.com/api//api/refresh-token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    const data = await response.json();
    if (response.ok) {
      setToken(data.access, refreshToken);
      return data.access;
    } else {
      removeToken();
      return null;
    }
  } catch (error) {
    removeToken();
    return null;
  }
};
