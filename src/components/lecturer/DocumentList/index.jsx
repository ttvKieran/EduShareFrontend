import React, { useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel,
    IconButton
} from '@mui/material';
import {
    Upload as UploadIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Download as DownloadIcon,
    Folder as FolderIcon,
    MenuBook as MenuBookIcon,
    GridView as GridViewIcon,
    ViewList as ViewListIcon,
} from '@mui/icons-material';
import LecturerDocumentCard from '../DocumentCard';
import DocumentPreview from '../DocumentPreview';
import DocumentUpload from '../DocumentUpload';

const DocumentList = ({
    documents = [],
    title = "Tài liệu học tập",
    icon: IconComponent = MenuBookIcon,
    showUploadButton = true,
    showFilters = true,
    showPagination = true,
    itemsPerPageOptions = [6, 12, 24, 48],
    defaultItemsPerPage = 12,
    onPreview,
    onDownload,
    onEdit,
    onDelete,
    onTogglePublish,
    onUpload,
    searchPlaceholder = "Tìm kiếm tài liệu...",
    emptyStateMessage = "Chưa có tài liệu nào",
    emptyStateDescription = "Hãy tải lên tài liệu đầu tiên",
    filterOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'lecture', label: 'Bài giảng' },
        { value: 'exercise', label: 'Bài tập' },
        { value: 'reference', label: 'Tài liệu tham khảo' },
        { value: 'exam', label: 'Đề thi' },
        { value: 'curriculum', label: 'Giáo trình' }
    ]
}) => {
    // States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultItemsPerPage);
    const [previewDocument, setPreviewDocument] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    // Filter documents
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination
    const paginatedDocuments = showPagination
        ? filteredDocuments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : filteredDocuments;

    // Event handlers
    const handlePreview = (document) => {
        setPreviewDocument(document);
        setPreviewOpen(true);
        onPreview?.(document);
    };

    const handleDownload = (document) => {
        onDownload?.(document);
    };

    const handleEdit = (document) => {
        onEdit?.(document);
    };

    const handleDelete = (document) => {
        if (window.confirm(`Bạn có chắc muốn xóa tài liệu "${document.title}"?`)) {
            onDelete?.(document);
        }
    };

    const handleTogglePublish = (document) => {
        onTogglePublish?.(document);
    };

    const handleUpload = () => {
        // if (onUpload) {
        //     onUpload();
        // } else {
            setUploadDialogOpen(true);
        // }
    };

    const handleUploadSubmit = async (formData) => {
        // Process upload
        console.log('Upload data:', formData);
        // Call API
        // Update documents list
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(0); // Reset to first page when searching
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setPage(0); // Reset to first page when filtering
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconComponent sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {title} ({filteredDocuments.length})
                    </Typography>
                </Box>
                {showUploadButton && (
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={handleUpload}
                    >
                        Tải tài liệu lên
                    </Button>
                )}
            </Box>

            {/* Filters */}
            {showFilters && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Loại tài liệu</InputLabel>
                                <Select
                                    value={selectedCategory}
                                    label="Loại tài liệu"
                                    onChange={handleCategoryChange}
                                >
                                    {filterOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<FilterIcon />}
                                >
                                    Bộ lọc
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<DownloadIcon />}
                                >
                                    Xuất Excel
                                </Button>
                            </Box>
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
            )}

            {/* Documents Grid */}
            {paginatedDocuments.length > 0 ? (
                <>
                    <Grid container spacing={3}>
                        {paginatedDocuments.map((document) => (
                            <Grid item xs={12} md={6} lg={4} key={document._id || document.id}
                                sx={{ width: `${viewMode === 'grid' ? '31.8%' : '100%'}` }}>
                                <LecturerDocumentCard
                                    document={document}
                                    onPreview={handlePreview}
                                    onDownload={handleDownload}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onTogglePublish={handleTogglePublish}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {showPagination && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <TablePagination
                                component="div"
                                count={filteredDocuments.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={itemsPerPageOptions}
                                labelRowsPerPage="Tài liệu mỗi trang:"
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
                                }
                                sx={{
                                    '& .MuiTablePagination-toolbar': {
                                        justifyContent: 'center'
                                    }
                                }}
                            />
                        </Box>
                    )}
                </>
            ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <FolderIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        {searchQuery || selectedCategory !== 'all' ? 'Không tìm thấy tài liệu nào' : emptyStateMessage}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {searchQuery || selectedCategory !== 'all'
                            ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                            : emptyStateDescription
                        }
                    </Typography>
                    {showUploadButton && (
                        <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            onClick={handleUpload}
                        >
                            Tải tài liệu lên
                        </Button>
                    )}
                </Box>
            )}

            {/* Document Preview Dialog */}
            <DocumentPreview
                document={previewDocument}
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                onDownload={handleDownload}
                onEdit={handleEdit}
            />

            {/* Default Upload Dialog (nếu không có custom onUpload) */}
            {!onUpload && (
                <Dialog
                    open={uploadDialogOpen}
                    onClose={() => setUploadDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Tải tài liệu lên</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tiêu đề tài liệu"
                                    placeholder="Nhập tiêu đề tài liệu..."
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Loại tài liệu</InputLabel>
                                    <Select label="Loại tài liệu" defaultValue="">
                                        <MenuItem value="lecture">Bài giảng</MenuItem>
                                        <MenuItem value="exercise">Bài tập</MenuItem>
                                        <MenuItem value="reference">Tài liệu tham khảo</MenuItem>
                                        <MenuItem value="exam">Đề thi</MenuItem>
                                        <MenuItem value="curriculum">Giáo trình</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={<Switch defaultChecked />}
                                    label="Xuất bản ngay"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Mô tả"
                                    multiline
                                    rows={3}
                                    placeholder="Mô tả ngắn về tài liệu..."
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        border: '2px dashed',
                                        borderColor: 'grey.300',
                                        borderRadius: 1,
                                        p: 4,
                                        textAlign: 'center',
                                        bgcolor: 'grey.50',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            bgcolor: 'primary.50'
                                        }
                                    }}
                                >
                                    <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                        Kéo thả file vào đây hoặc click để chọn
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Hỗ trợ: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, MP4, AVI (Tối đa 100MB)
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setUploadDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="contained" startIcon={<UploadIcon />}>
                            Tải lên
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <DocumentUpload
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUpload={handleUploadSubmit}
                courseId={"1234"} //courseId
            />
        </Box>
    );
};

export default DocumentList;