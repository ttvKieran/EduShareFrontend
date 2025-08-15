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

const MyDocuments = () => {
    const { user } = useAuth();
    
    // Documents Component - Updated to match student DocumentCard style
  const mockDocumentsDetailed = [
        {
            _id: '1',
            title: 'Slide Bài 1 - Giới thiệu Java và OOP',
            description: 'Tài liệu giới thiệu về ngôn ngữ lập trình Java và các khái niệm cơ bản về lập trình hướng đối tượng',
            type: 'lecture',
            mimeType: 'application/pdf',
            fileType: 'pdf',
            fileSize: 2621440,
            viewCount: 42,
            downloadCount: 35,
            authors: [{ name: 'TS. Nguyễn Văn Minh' }],
            createdAt: '2024-08-01T09:00:00Z',
            updatedAt: '2024-08-01T09:00:00Z',
            category: 'lecture',
            isPublished: true,
            tags: ['java', 'oop', 'introduction']
        },
        {
            _id: '2',
            title: 'Hướng dẫn cài đặt Eclipse IDE',
            description: 'Tài liệu hướng dẫn chi tiết cách cài đặt và cấu hình Eclipse IDE cho lập trình Java',
            type: 'reference',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            fileType: 'docx',
            fileSize: 1887436,
            viewCount: 38,
            downloadCount: 32,
            authors: [{ name: 'TS. Nguyễn Văn Minh' }],
            createdAt: '2024-08-01T10:30:00Z',
            updatedAt: '2024-08-01T10:30:00Z',
            category: 'guide',
            isPublished: true,
            tags: ['eclipse', 'ide', 'setup']
        },
        {
            _id: '3',
            title: 'Video bài giảng - OOP Concepts',
            description: 'Video bài giảng chi tiết về các khái niệm cơ bản trong lập trình hướng đối tượng',
            type: 'lecture',
            mimeType: 'video/mp4',
            fileType: 'mp4',
            fileSize: 131072000,
            viewCount: 25,
            downloadCount: 15,
            authors: [{ name: 'TS. Nguyễn Văn Minh' }],
            createdAt: '2024-08-05T14:00:00Z',
            updatedAt: '2024-08-05T14:00:00Z',
            category: 'lecture',
            isPublished: true,
            tags: ['video', 'oop', 'concepts']
        },
        {
            _id: '4',
            title: 'Bài tập thực hành Inheritance',
            description: 'Bộ bài tập thực hành về kế thừa trong Java với các ví dụ cụ thể',
            type: 'exercise',
            mimeType: 'application/pdf',
            fileType: 'pdf',
            fileSize: 1048576,
            viewCount: 30,
            downloadCount: 28,
            authors: [{ name: 'TS. Nguyễn Văn Minh' }],
            createdAt: '2024-08-08T11:00:00Z',
            updatedAt: '2024-08-08T11:00:00Z',
            category: 'exercise',
            isPublished: false,
            tags: ['inheritance', 'practice', 'java']
        },
        {
            _id: '5',
            title: 'Đề thi giữa kỳ 2023',
            description: 'Đề thi giữa kỳ môn Lập trình hướng đối tượng năm 2023 để tham khảo',
            type: 'exam',
            mimeType: 'application/pdf',
            fileType: 'pdf',
            fileSize: 524288,
            viewCount: 15,
            downloadCount: 12,
            authors: [{ name: 'TS. Nguyễn Văn Minh' }],
            createdAt: '2024-08-10T16:00:00Z',
            updatedAt: '2024-08-10T16:00:00Z',
            category: 'exam',
            isPublished: true,
            tags: ['exam', 'midterm', 'reference']
        },
        // Add more mock documents to test pagination
        ...Array.from({ length: 15 }, (_, index) => ({
            _id: `${index + 6}`,
            title: `Tài liệu mẫu ${index + 1}`,
            description: `Mô tả cho tài liệu mẫu số ${index + 1}`,
            type: ['lecture', 'exercise', 'reference', 'exam'][index % 4],
            mimeType: 'application/pdf',
            fileType: 'pdf',
            fileSize: Math.floor(Math.random() * 10000000) + 500000,
            viewCount: Math.floor(Math.random() * 100),
            downloadCount: Math.floor(Math.random() * 50),
            authors: [{ name: 'TS. Nguyễn Văn Minh' }],
            createdAt: new Date(2024, 7, Math.floor(Math.random() * 30) + 1).toISOString(),
            updatedAt: new Date(2024, 7, Math.floor(Math.random() * 30) + 1).toISOString(),
            category: 'lecture',
            isPublished: Math.random() > 0.3,
            tags: ['tag1', 'tag2', 'tag3']
        }))
    ];

    const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false);

    // Event handlers for documents
    const handleDocumentPreview = (document) => {
        console.log('Preview document:', document);
    };

    const handleDocumentDownload = (document) => {
        console.log('Download document:', document);
    };

    const handleDocumentEdit = (document) => {
        console.log('Edit document:', document);
    };

    const handleDocumentDelete = (document) => {
        console.log('Delete document:', document);
        // Implement delete logic here
    };

    const handleDocumentTogglePublish = (document) => {
        console.log('Toggle publish:', document);
        // Implement publish/unpublish logic here
    };

    const handleDocumentUpload = () => {
        setUploadDocumentOpen(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Document List */}
            <DocumentList
                        documents={mockDocumentsDetailed}
                        title="Tài liệu học tập"
                        icon={MenuBookIcon}
                        onPreview={handleDocumentPreview}
                        onDownload={handleDocumentDownload}
                        onEdit={handleDocumentEdit}
                        onDelete={handleDocumentDelete}
                        onTogglePublish={handleDocumentTogglePublish}
                        onUpload={handleDocumentUpload}
                        searchPlaceholder="Tìm kiếm tài liệu trong môn học..."
                        emptyStateMessage="Chưa có tài liệu nào trong môn học này"
                        emptyStateDescription="Hãy tải lên tài liệu đầu tiên cho môn học này"
                    />
        </Box>
    );
};

export default MyDocuments;