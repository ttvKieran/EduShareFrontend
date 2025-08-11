import { useState, useEffect } from 'react';
import API_BASE_URL from "../configs/system";
import { useAuth } from '../contexts/AuthContext';
const useDocuments = (filters = {}) => {
  const { authenticatedFetch } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0
  });

  const fetchDocuments = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page,
        limit: pagination.limit,
        ...filters
      });

      const response = await authenticatedFetch(`${API_BASE_URL}/student/documents?${queryParams}`);

      const result = await response.json();

      if (result.success) {
        setDocuments(result.data.documents);
        setPagination(result.data.pagination);
      } else {
        setError(result.message || 'Lỗi khi tải danh sách tài liệu');
      }
    } catch (error) {
      console.error('Fetch documents failed:', error);
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  return {
    documents,
    loading,
    error,
    pagination,
    fetchDocuments,
    refetch: () => fetchDocuments(pagination.page)
  };
};

export default useDocuments;