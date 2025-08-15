import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Select,
  Breadcrumbs,
  Link,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  BookmarkBorder as BookmarkBorderIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  Description as DescriptionIcon,
  Home as HomeIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  AudioFile as AudioIcon,
  Archive as ArchiveIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import DocumentCard from '../DocumentCard';
import useDocuments from '../../../helpers/fetchDocument';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CustomBreadcrumbs from '../../shared/Breadcrumb';
// Tạo theme phù hợp với màu trắng và đỏ
const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
      light: '#ff6659',
      dark: '#9a0007',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f5f5f5',
      light: '#ffffff',
      dark: '#c2c2c2',
      contrastText: '#000',
    },
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      color: '#333',
    },
    h6: {
      fontWeight: 500,
      color: '#555',
    },
    body2: {
      color: '#666',
    },
  },
});
const categories = ['Tất cả', 'Giáo trình', 'Công nghệ thông tin', 'Toán học', 'Kinh tế', 'Vật lý', 'Ngoại ngữ'];
const DocumentsList = ({ typeSelect, typeName, nav, navHref, classId, courseId, search, setCourseCount, setClassCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    type: '',
    search: ''
  });
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      type: typeSelect
    }));
  }, [typeSelect]);
  if(classId){
      filters.classId = classId;
    }
    if(courseId){
      filters.courseId = courseId;
    }
  const { documents, loading, error, pagination, fetchDocuments } = useDocuments(filters);
  if(classId){
      setClassCount(documents.length)
    }
    if(courseId){
      setCourseCount(documents.length)
    }
  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || doc.type === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return b.downloadCount - a.downloadCount;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    // setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePageChange = (event, page) => {
    fetchDocuments(page);
  };

  if (loading && filteredAndSortedDocuments.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', py: 3 }}>
        <Container maxWidth="xl">
          {!search && 
            <CustomBreadcrumbs
            items={[
              (navHref ?
                { label: nav, href: navHref } :
                { label: nav }
              ),
              { label: typeName }
            ]}
          />
          }
          {/* Header */}
          {/* <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Thư viện tài liệu
      </Typography> */}

          {/* Filters */}
          {!search && 
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm tài liệu, tác giả..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Danh mục"
                    onChange={handleCategoryChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sắp xếp</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sắp xếp"
                    onChange={handleSortChange}
                  >
                    <MenuItem value="newest">Mới nhất</MenuItem>
                    <MenuItem value="oldest">Cũ nhất</MenuItem>
                    <MenuItem value="popular">Phổ biến</MenuItem>
                    <MenuItem value="title">Tên A-Z</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                  >
                    <GridViewIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setViewMode('list')}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                  >
                    <ViewListIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          }

          {/* Error */}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {/* Documents Grid */}
          <Grid container spacing={3}>
            {filteredAndSortedDocuments.map((document) => (
              <Grid item xs={12} sm={6} md={4} key={document._id} lg={viewMode === 'grid' ? 4 : 12}
                sx={{ width: `${viewMode === 'grid' ? '31.6%' : '100%'}` }}>
                <DocumentCard document={document} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}

          {/* No results */}
          {filteredAndSortedDocuments.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy tài liệu nào
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DocumentsList;