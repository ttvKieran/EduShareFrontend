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
import * as XLSX from 'xlsx';

const StudentsDialog = ({ 
  open, 
  onClose, 
  selectedCourse, 
  students, 
  studentsLoading 
}) => {
  console.log("check: ", students);
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
      student.userCode.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.administrativeClass.code.toLowerCase().includes(studentSearchQuery.toLowerCase())
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
      const newSelecteds = filteredStudents.map((student) => student._id);
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

  // Print functionality
  const handlePrintList = useCallback(() => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Danh sách sinh viên - ${selectedCourse?.name || 'Lớp học'}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12px;
              margin: 20px;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 18px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .header h2 {
              margin: 5px 0;
              font-size: 16px;
              font-weight: normal;
            }
            .course-info {
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
            }
            .course-info div {
              flex: 1;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
              text-align: center;
            }
            .text-center {
              text-align: center;
            }
            .text-right {
              text-align: right;
            }
            .footer {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
            .signature {
              text-align: center;
              margin-top: 50px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</h1>
            <h2>KHOA CÔNG NGHỆ THÔNG TIN</h2>
            <h1 style="margin-top: 20px;">DANH SÁCH SINH VIÊN</h1>
          </div>

          <div class="course-info">
            <div>
              <strong>Môn học:</strong> ${selectedCourse?.name || 'N/A'}<br>
              <strong>Mã môn:</strong> ${selectedCourse?.code || 'N/A'}<br>
              <strong>Học kỳ:</strong> ${selectedCourse?.semesterName || 'N/A'}
            </div>
            <div style="text-align: right;">
              <strong>Ngày in:</strong> ${new Date().toLocaleDateString('vi-VN')}<br>
              <strong>Tổng số SV:</strong> ${filteredStudents.length}<br>
              <strong>Số tín chỉ:</strong> ${selectedCourse?.credits || 'N/A'}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50px;">STT</th>
                <th style="width: 120px;">Mã sinh viên</th>
                <th style="width: 200px;">Họ và tên</th>
                <th style="width: 100px;">Ngày sinh</th>
                <th style="width: 100px;">Lớp</th>
                <th style="width: 150px;">Ghi chú</th>
                <th style="width: 120px;">Chữ ký</th>
              </tr>
            </thead>
            <tbody>
              ${filteredStudents.map((student, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td class="text-center">${student.userCode}</td>
                  <td>${student.fullName}</td>
                  <td class="text-center">${student.birthDate || 'N/A'}</td>
                  <td class="text-center">${student.administrativeClass?.code || 'N/A'}</td>
                  <td></td>
                  <td></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div class="signature">
              <p><strong>Trưởng khoa</strong></p>
              <p style="margin-top: 80px;">(Ký tên và đóng dấu)</p>
            </div>
            <div class="signature">
              <p><strong>Giảng viên</strong></p>
              <p style="margin-top: 80px;">${selectedCourse?.instructor || 'Tên giảng viên'}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }, [filteredStudents, selectedCourse]);

  // Export Excel functionality
  const handleExportExcel = useCallback(() => {
    try {
      // Chuẩn bị dữ liệu cho Excel
      const excelData = filteredStudents.map((student, index) => ({
        'STT': index + 1,
        'Mã sinh viên': student.userCode,
        'Họ và tên': student.fullName,
        'Ngày sinh': student.birthDate || 'N/A',
        'Lớp': student.administrativeClass?.code || 'N/A',
        'Email': student.email || 'N/A',
        'Số điện thoại': student.phoneNumber || 'N/A',
        'Địa chỉ': student.address || 'N/A',
        'Ghi chú': student.note || ''
      }));

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Thiết lập độ rộng cột
      const colWidths = [
        { wch: 5 },   // STT
        { wch: 15 },  // Mã sinh viên
        { wch: 25 },  // Họ và tên
        { wch: 12 },  // Ngày sinh
        { wch: 12 },  // Lớp
        { wch: 25 },  // Email
        { wch: 15 },  // Số điện thoại
        { wch: 30 },  // Địa chỉ
        { wch: 20 }   // Ghi chú
      ];
      ws['!cols'] = colWidths;

      // Thêm thông tin header
      const courseInfo = [
        ['DANH SÁCH SINH VIÊN'],
        [''],
        ['Môn học:', selectedCourse?.name || 'N/A'],
        ['Mã môn:', selectedCourse?.code || 'N/A'],
        ['Học kỳ:', selectedCourse?.semesterName || 'N/A'],
        ['Số tín chỉ:', selectedCourse?.credits || 'N/A'],
        ['Tổng số sinh viên:', filteredStudents.length],
        ['Ngày xuất:', new Date().toLocaleDateString('vi-VN')],
        ['']
      ];

      // Chèn thông tin header vào đầu worksheet
      XLSX.utils.sheet_add_aoa(ws, courseInfo, { origin: 'A1' });
      
      // Điều chỉnh vị trí dữ liệu sinh viên
      const studentDataRange = XLSX.utils.decode_range(ws['!ref']);
      studentDataRange.s.r = courseInfo.length; // Bắt đầu từ dòng sau header
      
      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách sinh viên');

      // Tạo tên file
      const fileName = `DanhSach_SinhVien_${selectedCourse?.code || 'Class'}_${new Date().getTime()}.xlsx`;

      // Xuất file
      XLSX.writeFile(wb, fileName);

      // Thông báo thành công
      console.log('Xuất Excel thành công:', fileName);
      
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error);
      alert('Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại.');
    }
  }, [filteredStudents, selectedCourse]);

  // Export selected students only
  const handleExportSelectedStudents = useCallback(() => {
    if (selectedStudents.length === 0) {
      alert('Vui lòng chọn ít nhất một sinh viên để xuất danh sách');
      return;
    }

    const selectedStudentData = filteredStudents.filter(student => 
      selectedStudents.includes(student._id)
    );

    try {
      const excelData = selectedStudentData.map((student, index) => ({
        'STT': index + 1,
        'Mã sinh viên': student.userCode,
        'Họ và tên': student.fullName,
        'Ngày sinh': student.birthDate || 'N/A',
        'Lớp': student.administrativeClass?.code || 'N/A',
        'Email': student.email || 'N/A',
        'Số điện thoại': student.phoneNumber || 'N/A',
        'Địa chỉ': student.address || 'N/A',
        'Ghi chú': student.note || ''
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      const colWidths = [
        { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, 
        { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 20 }
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Sinh viên đã chọn');

      const fileName = `DanhSach_SinhVien_DaChon_${selectedCourse?.code || 'Class'}_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error('Lỗi khi xuất Excel cho sinh viên đã chọn:', error);
      alert('Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại.');
    }
  }, [selectedStudents, filteredStudents, selectedCourse]);

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
              {numSelected > 0 && ` • Đã chọn: ${numSelected}`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
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
              onClick={handlePrintList}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.50'
                }
              }}
            >
              In danh sách
            </Button>
            
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              size="small"
              onClick={handleExportExcel}
              sx={{
                backgroundColor: 'success.main',
                '&:hover': {
                  backgroundColor: 'success.dark'
                }
              }}
            >
              Xuất Excel
            </Button>

            {numSelected > 0 && (
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                size="small"
                onClick={handleExportSelectedStudents}
                sx={{
                  borderColor: 'success.main',
                  color: 'success.main',
                  '&:hover': {
                    borderColor: 'success.dark',
                    backgroundColor: 'success.50'
                  }
                }}
              >
                Xuất đã chọn ({numSelected})
              </Button>
            )}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {studentsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>Đang tải danh sách sinh viên...</Typography>
                    <LinearProgress sx={{ mt: 2 }} />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStudents.map((student, index) => {
                  const isItemSelected = isStudentSelected(student._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleSelectStudent(event, student._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={student._id}
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
                        {student.userCode}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {student.fullName}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {student.birthDate || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip 
                          label={student.administrativeClass?.code || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
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