import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API_BASE_URL from "../configs/system";

const FavoriteContext = createContext();

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
};

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Fetch danh sách favorites khi component mount
  const fetchFavorites = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/student/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const favoriteIds = new Set(result.data.map(fav => fav.documentId));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      fetchFavorites();
    }
  }, [fetchFavorites, initialized]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (documentId) => {
    const isFavorited = favorites.has(documentId);
    
    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const response = await fetch(`${API_BASE_URL}/student/documents/${documentId}/favorite`, {
        method,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.success || response.ok) {
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (isFavorited) {
            newFavorites.delete(documentId);
          } else {
            newFavorites.add(documentId);
          }
          return newFavorites;
        });
        return !isFavorited;
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }, [favorites]);

  const isFavorited = useCallback((documentId) => {
    return favorites.has(documentId);
  }, [favorites]);

  const value = {
    favorites,
    loading,
    toggleFavorite,
    isFavorited,
    fetchFavorites,
    initialized
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};