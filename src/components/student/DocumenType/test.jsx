import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Pagination,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Divider,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Breadcrumbs,
  Link,
  Badge
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
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

// Dữ liệu mẫu cho tài liệu giáo trình
const sampleDocuments = [
  {
    id: 1,
    title: 'Lập trình Web với React',
    author: 'TS. Nguyễn Văn A',
    category: 'Công nghệ thông tin',
    publishYear: 2023,
    pages: 320,
    downloads: 1250,
    views: 3420,
    description: 'Giáo trình hướng dẫn lập trình web hiện đại với React, bao gồm các khái niệm cơ bản đến nâng cao.',
    coverImage: '/api/placeholder/200/280',
    fileSize: '15.2 MB',
    format: 'pdf',
    status: 'Có sẵn'
  },
  {
    id: 2,
    title: 'Cơ sở dữ liệu nâng cao',
    author: 'PGS. Trần Thị B',
    category: 'Công nghệ thông tin',
    publishYear: 2022,
    pages: 450,
    downloads: 890,
    views: 2180,
    description: 'Nghiên cứu sâu về thiết kế và tối ưu hóa cơ sở dữ liệu, bao gồm NoSQL và Big Data.',
    coverImage: '/api/placeholder/200/280',
    fileSize: '22.8 MB',
    format: 'pdf',
    status: 'Có sẵn'
  },
  {
    id: 3,
    title: 'Toán học cao cấp A1',
    author: 'GS. Lê Văn C',
    category: 'Toán học',
    publishYear: 2023,
    pages: 280,
    downloads: 2340,
    views: 5670,
    description: 'Giáo trình toán học cao cấp dành cho sinh viên năm thứ nhất các ngành kỹ thuật.',
    coverImage: '/api/placeholder/200/280',
    fileSize: '18.5 MB',
    format: 'pdf',
    status: 'Có sẵn'
  },
  {
    id: 4,
    title: 'Quản trị doanh nghiệp',
    author: 'TS. Phạm Thị D',
    category: 'Kinh tế',
    publishYear: 2022,
    pages: 380,
    downloads: 1560,
    views: 4230,
    description: 'Các nguyên lý và phương pháp quản trị doanh nghiệp hiện đại trong thời đại số.',
    coverImage: '/api/placeholder/200/280',
    fileSize: '20.1 MB',
    format: 'pdf',
    status: 'Có sẵn'
  },
  {
    id: 5,
    title: 'Kế toán tài chính',
    author: 'ThS. Hoàng Văn E',
    category: 'Kinh tế',
    publishYear: 2023,
    pages: 320,
    downloads: 980,
    views: 2890,
    description: 'Hướng dẫn chi tiết về kế toán tài chính theo chuẩn mực Việt Nam và quốc tế.',
    coverImage: '/api/placeholder/200/280',
    fileSize: '16.7 MB',
    format: 'pdf',
    status: 'Có sẵn'
  },
  {
    id: 6,
    title: 'Vật lý đại cương',
    author: 'PGS. Đinh Thị F',
    category: 'Vật lý',
    publishYear: 2022,
    pages: 420,
    downloads: 1870,
    views: 3950,
    description: 'Giáo trình vật lý đại cương với các bài thực hành và ví dụ minh họa phong phú.',
    coverImage: '/api/placeholder/200/280',
    fileSize: '25.3 MB',
    format: 'pdf',
    status: 'Có sẵn'
  },
  {
    id: 7,
    title: 'Mạng máy tính',
    author: 'TS. Vũ Văn G',
    category: 'Công nghệ thông tin',
    publishYear: 2023,
    pages: 360,
    downloads: 1420,
    views: 3120,
    description: 'Kiến thức về mạng máy tính từ cơ bản đến nâng cao, bao gồm bảo mật mạng.',
    coverImage: '/api/placeholder/200/280',
    fileSize: '19.8 MB',
    format: 'pdf',
    status: 'Có sẵn'
  },
  {
    id: 8,
    title: 'Tiếng Anh chuyên ngành',
    author: 'ThS. Ngô Thị H',
    category: 'Ngoại ngữ',
    publishYear: 2022,
    pages: 250,
    downloads: 2100,
    views: 4560,
    description: 'Giáo trình tiếng Anh chuyên ngành dành cho sinh viên các ngành kỹ thuật.',
    coverImage: '/api/placeholder/200/280',
    fileSize: '12.4 MB',
    format: 'pdf',
    status: 'Có sẵn'
  }
];

const categories = ['Tất cả', 'Công nghệ thông tin', 'Toán học', 'Kinh tế', 'Vật lý', 'Ngoại ngữ'];

export default function DocumentListPage() {
  const [documents, setDocuments] = useState(sampleDocuments);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf': return <PdfIcon sx={{ color: '#d32f2f' }} />;
            case 'video': return <VideoIcon sx={{ color: '#1976d2' }} />;
            case 'ppt': return <DescriptionIcon sx={{ color: '#ed6c02' }} />;
            case 'doc': return <DescriptionIcon sx={{ color: '#2e7d32' }} />;
            default: return <DescriptionIcon sx={{ color: '#757575' }} />;
        }
    };

  // Lọc và sắp xếp tài liệu
  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.publishYear - a.publishYear;
        case 'oldest':
          return a.publishYear - b.publishYear;
        case 'popular':
          return b.downloads - a.downloads;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredAndSortedDocuments.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const displayedDocuments = filteredAndSortedDocuments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const DocumentCard = ({ document }) => (
        <Card
            elevation={2}
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                    elevation: 8,
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
            }}
        >
            <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: '#f5f5f5' }}>
                        {getFileIcon(document.format)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            component="h3"
                            sx={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                mb: 1,
                                wordBreak: 'break-word',
                                whiteSpace: 'normal',
                                overflowWrap: 'break-word',
                            }}
                        >
                            {document.title}
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {document.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                        {document.author}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                        {new Date("2024-01-15").toLocaleDateString('vi-VN')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Kích thước: {document.fileSize}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 4, marginRight: 2 }}>
                        <Badge badgeContent={document.views} color="primary" max={999} >
                            <ViewIcon sx={{ fontSize: 18, color: '#666' }} />
                        </Badge>
                        <Badge badgeContent={document.downloads} color="secondary" max={999}>
                            <DownloadIcon sx={{ fontSize: 18, color: '#666' }} />
                        </Badge>
                    </Box>
                </Box>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ViewIcon />}
                    sx={{
                        borderColor: '#d32f2f',
                        color: '#d32f2f',
                        '&:hover': {
                            borderColor: '#b71c1c',
                            backgroundColor: '#ffebee'
                        }
                    }}
                >
                    Xem
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<DownloadIcon />}
                    sx={{
                        backgroundColor: '#d32f2f',
                        '&:hover': {
                            backgroundColor: '#b71c1c'
                        }
                    }}
                >
                    Tải về
                </Button>
            </CardActions>
        </Card>
    );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Trang chủ
            </Link>
            <Typography color="text.primary">Tài liệu giáo trình</Typography>
          </Breadcrumbs>

          {/* Search and Filter Section */}
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

          {/* Results Summary */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Tìm thấy {filteredAndSortedDocuments.length} tài liệu
              {searchTerm && ` cho "${searchTerm}"`}
              {selectedCategory !== 'Tất cả' && ` trong danh mục "${selectedCategory}"`}
            </Typography>
          </Box>

          {/* Document Grid */}
          <Grid container spacing={3} sx={{display: 'flex', justifyContent: 'start'}}>
            {displayedDocuments.map((document) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                lg={viewMode === 'grid' ? 4 : 12}
                sx={{width: `${viewMode === 'grid' ? '32%' : '100%'}`}}
                key={document.id}
              >
                <DocumentCard document={document} />
              </Grid>
            ))}
          </Grid>

          {/* Empty State */}
          {filteredAndSortedDocuments.length === 0 && (
            <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
              <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Không tìm thấy tài liệu nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn
              </Typography>
            </Paper>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}