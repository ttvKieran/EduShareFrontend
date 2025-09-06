import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Tabs,
    Tab,
    Typography,
    Chip,
    Grid,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Alert,
    LinearProgress,
    Divider
} from '@mui/material';
import {
    MenuBook as MenuBookIcon,
    Folder as FolderIcon,
    Description as DescriptionIcon,
    CloudUpload as CloudUploadIcon,
    Analytics as AnalyticsIcon,
    Star as StarIcon,
    Schedule as ScheduleIcon,
    Visibility as VisibilityIcon,
    Download as DownloadIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Share as ShareIcon,
    Archive as ArchiveIcon
} from '@mui/icons-material';
import DocumentList from '../DocumentList';
import { useAuth } from '../../../contexts/AuthContext';

import { useNavigate, useParams } from 'react-router-dom';
import DocumentPreview from '../DocumentPreview';
import Notifications from '../CourseNotification';
import API_BASE_URL from '../../../configs/system';
import { Editor } from '@tinymce/tinymce-react';
import Classes from '../Classes';

const MyDocuments = () => {
    const { authenticatedFetch } = useAuth();
    const navigate = useNavigate();

    const [documents, setDocuments] = useState([]);
    const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false);
    // Fetch documents
    const fetchDocuments = async () => {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/documents/`);

            if (response.ok) {
                const data = await response.json();
                setDocuments(data.data || []);
            } else {
                console.error('Failed to fetch documents');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchDocuments();
    }, []);

    const transformedDocuments = documents.map(doc => ({
        _id: doc._id,
        title: doc.title,
        description: doc.description,
        type: doc.type,
        mimeType: doc.mimeType,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        viewCount: doc.viewCount,
        downloadCount: doc.downloadCount,
        authors: doc.authors,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        category: doc.type,
        isPublished: doc.status === 'active',
        tags: doc.tags || [],
        downloadUrl: doc.downloadUrl,
        previewUrl: doc.previewUrl
    }));

    const handleDocumentPreview = (document) => {
        console.log('Preview document:', document);
        if (document.previewUrl) {
            window.open(document.previewUrl, '_blank');
        }
    };

    const handleDocumentDownload = (document) => {
        console.log('Download document:', document);
        if (document.downloadUrl) {
            window.open(document.downloadUrl, '_blank');
        }
    };

    const handleDocumentEdit = (document) => {
        console.log('Edit document:', document);
    };

    const handleDocumentDelete = (document) => {
        console.log('Delete document:', document);
    };

    const handleDocumentTogglePublish = (document) => {
        console.log('Toggle publish:', document);
    };

    const handleDocumentUpload = () => {
        setUploadDocumentOpen(true);
    };

    return (
        <Box sx={{padding: '30px'}}>
            <DocumentList
                documents={transformedDocuments}
                title="Tài liệu môn học"
                icon={MenuBookIcon}
                onPreview={handleDocumentPreview}
                onDownload={handleDocumentDownload}
                onEdit={handleDocumentEdit}
                onDelete={handleDocumentDelete}
                onTogglePublish={handleDocumentTogglePublish}
                onUpload={handleDocumentUpload}
                searchPlaceholder="Tìm kiếm tài liệu môn học..."
                emptyStateMessage="Chưa có tài liệu nào cho môn học này"
                emptyStateDescription="Hãy tải lên tài liệu đầu tiên cho môn học"
                filterOptions={[
                    { value: 'all', label: 'Tất cả loại' },
                    { value: 'curriculum', label: 'Giáo trình' },
                    { value: 'lecture', label: 'Bài giảng' },
                    { value: 'exercise', label: 'Bài tập' },
                    { value: 'reference', label: 'Tài liệu tham khảo' },
                    { value: 'exam', label: 'Đề thi' }
                ]}
            />
        </Box>

    );
};

export default MyDocuments;