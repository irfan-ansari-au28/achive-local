
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { getPresignedUrl } from '../../api/apiService';
import { convertDateFormat, formatDateToLocaleString } from '../../utils/helper';
import NoDataCard from '../NoDataCard/NoDataCard';

const columns = [
  { id: 'date', label: 'Request Date', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'link', label: 'Download Link', minWidth: 170 },
];

function StatusTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');

  const { statusData } = useSelector((state) => state.downloads);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // LOGIC FOR BULK DOWNLOAD
  // Function to convert base64 string to byte array
  const base64ToByteArray = (base64String) => {
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Function to download a file from a byte array
  const downloadFile = (byteArray, fileName, mimeType) => {
    const blob = new Blob([byteArray], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadClick = async (url) => {
    if (url) {
      const data = await getPresignedUrl(url);
      const byteArray = base64ToByteArray(data.data); // Convert base64 string to byte array
      const fileName = data.filename;
      const mimeType = data.mimeType;
      downloadFile(byteArray, fileName, mimeType);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = useMemo(() => {
    // Create a shallow copy of the array to avoid mutating the original data
    const dataCopy = [...statusData];
  
    return dataCopy.sort((a, b) => {
      if (orderBy === 'date') {
        // Compare yyyymmdd strings directly for sorting
        return (a.createdOn < b.createdOn ? -1 : 1) * (order === 'asc' ? 1 : -1);
      }
      return 0;
    });
  }, [statusData, order, orderBy]);
  

  if (statusData.length === 0) {
    return <NoDataCard />;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          sx={{
            '& .MuiTableCell-root': {
              fontSize: '14px',
              fontWeight: 500,
              color: '#190134',
            },
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F8F8F8' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.id === 'date' ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={order}
                      onClick={(event) => handleRequestSort(event, column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {convertDateFormat(row.createdOn)}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    {row.status === 'COMPLETED' ? (
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleDownloadClick(row.downlloadLink)}
                      >
                        Download
                      </Link>
                    ) : (
                      'Unavailable'
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={statusData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        // onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ '& .MuiIconButton-root': { color: 'primary.main' } }}
      />
    </>
  );
}

export default StatusTable;
