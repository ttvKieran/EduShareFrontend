// StudentsDialog.jsx - Component riêng biệt
import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  TextField,
  InputAdornment,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Chip,
  IconButton,
  TablePagination,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  PersonRemove as PersonRemoveIcon
} from '@mui/icons-material';

const StudentsDialog = ({ 
  open, 
  onClose, 
  selectedCourse, 
  students, 
  studentsLoading 
}) => {
  // Local states - chỉ trong dialog này
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Reset states khi dialog đóng/mở
  React.useEffect(() => {
    if (!open) {
      setStudentSearchQuery('');
      setPage(0);
      setSelectedStudents([]);
    }
  }, [open]);

  // Memoized filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.fullName.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.className.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );
  }, [students, studentSearchQuery]);

  // Memoized paginated students
  const paginatedStudents = useMemo(() => {
    return filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredStudents, page, rowsPerPage]);

  // Event handlers
  const handleSearchStudent = useCallback((e) => {
    setStudentSearchQuery(e.target.value);
    setPage(0);
  }, []);

  const handleSelectStudent = useCallback((event, id) => {
    event.stopPropagation();
    setSelectedStudents(prev => {
      const selectedIndex = prev.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = [...prev, id];
      } else if (selectedIndex === 0) {
        newSelected = prev.slice(1);
      } else if (selectedIndex === prev.length - 1) {
        newSelected = prev.slice(0, -1);
      } else if (selectedIndex > 0) {
        newSelected = [
          ...prev.slice(0, selectedIndex),
          ...prev.slice(selectedIndex + 1),
        ];
      }

      return newSelected;
    });
  }, []);

  const handleSelectAllStudents = useCallback((event) => {
    if (event.target.checked) {
      const newSelecteds = filteredStudents.map((student) => student.id);
      setSelectedStudents(newSelecteds);
      return;
    }
    setSelectedStudents([]);
  }, [filteredStudents]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const isStudentSelected = useCallback((id) => selectedStudents.indexOf(id) !== -1, [selectedStudents]);

  const numSelected = selectedStudents.length;
  const rowCount = filteredStudents.length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '100vh' }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Toolbar */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Tìm kiếm sinh viên..."
              value={studentSearchQuery}
              onChange={handleSearchStudent}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <Typography variant="body2" color="text.secondary">
              Tổng: {filteredStudents.length} sinh viên
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              size="small"
            >
              Thêm SV
            </Button>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              size="small"
              disabled={numSelected === 0}
            >
              Gửi email ({numSelected})
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              size="small"
            >
              In danh sách
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="small"
            >
              Xuất Excel
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell 
                  padding="checkbox"
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600
                  }}
                >
                  <Checkbox
                    color="default"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={handleSelectAllStudents}
                    sx={{ color: 'white' }}
                  />
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    minWidth: 80
                  }}
                >
                  STT
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    minWidth: 120
                  }}
                >
                  MSV
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    minWidth: 200
                  }}
                >
                  Họ và tên
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    minWidth: 120
                  }}
                >
                  Ngày sinh
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    minWidth: 120
                  }}
                >
                  Lớp
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    minWidth: 100
                  }}
                >
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentsLoading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>Đang tải danh sách sinh viên...</Typography>
                    <LinearProgress sx={{ mt: 2 }} />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStudents.map((student, index) => {
                  const isItemSelected = isStudentSelected(student.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleSelectStudent(event, student.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={student.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell 
                        component="th" 
                        id={labelId} 
                        scope="row"
                        sx={{ textAlign: 'center', fontWeight: 600 }}
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {student.studentCode}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {student.fullName}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {student.birthDate}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip 
                          label={student.className}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <IconButton 
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view student details
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle remove student
                          }}
                        >
                          <PersonRemoveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredStudents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50'
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(StudentsDialog);