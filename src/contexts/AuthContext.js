import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API_BASE_URL from "../configs/system";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = sessionStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [accessToken, setAccessToken] = useState(() => 
    sessionStorage.getItem('accessToken')
  );
  const [refreshToken, setRefreshToken] = useState(() => 
    sessionStorage.getItem('refreshToken')
  );
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
  const [loading, setLoading] = useState(false);

  // Enhanced fetch function
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    let token = accessToken || sessionStorage.getItem('accessToken');

    const makeRequest = async (currentToken) => {
      return fetch(`${url}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });
    };

    // First attempt
    let response = await makeRequest(token);

    // If 401, try refresh
    if (response.status === 401) {
      console.log("HELLO VN");
      const newToken = await refreshAccessToken();
      if (newToken) {
        response = await makeRequest(newToken);
      } else {
        logout();
        throw new Error('Authentication failed');
      }
    }

    return response;
  }, [accessToken]);

  // Refresh token function
  const refreshAccessToken = useCallback(async () => {
    const currentRefreshToken = refreshToken || sessionStorage.getItem('refreshToken');
    
    if (!currentRefreshToken) {
      logout();
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentRefreshToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.accessToken) {
        setAccessToken(data.accessToken);
        sessionStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      logout();
      return null;
    }
  }, [refreshToken]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        const { user, accessToken: newAccessToken, refreshToken: newRefreshToken } = data;
        
        setCurrentUser(user);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setIsAuthenticated(true);
        
        sessionStorage.setItem('accessToken', newAccessToken);
        sessionStorage.setItem('refreshToken', newRefreshToken);
        sessionStorage.setItem('currentUser', JSON.stringify(user));

        return { success: true, user };
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await fetch(`${API_BASE_URL}/user/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: currentUser?._id })
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setCurrentUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('token'); // Keep old token key for compatibility
    }
  }, [accessToken, currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      accessToken,
      isAuthenticated,
      loading,
      login,
      logout,
      authenticatedFetch,
      setCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};