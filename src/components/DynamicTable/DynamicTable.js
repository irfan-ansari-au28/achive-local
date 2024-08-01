import React, { useEffect, useState } from 'react';
import
{
default
as
DownloadFileIcon
}
from
'@mui/icons-material/Download'
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TableSortLabel,
  Box,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import DownloadIcon from '../../assets/icons/DownloadIcon';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntityData } from '../../features/entities/searchSlice';
import PaperLayout from '../PaperLayout/PaperLayout';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { getPresignedUrl, processBulkDownload } from '../../api/apiService';
import { setDownloadNotification } from '../../features/entities/entitiesSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { constructPayload, validatePayload } from '../../utils/helper';
import NoDataCard from '../NoDataCard/NoDataCard';

function DynamicTable({ selected, setSelected }) {
  const dispatch = useDispatch();

  const { pageDetails, loading, error } = useSelector((state) => state.entity);
  const entityName = useSelector(
    (state) => state.entities.selectedEntity.entityName
  );

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [open, setOpen] = useState(false);
  const { searchFields } = useSelector((state) => state.entities);

  const originalRows = useSelector((state) => state.entity.data);
  const [rows, setRows] = useState([]);

  // New: Retrieve configuration from Redux state based on entityName
  const masterConfig = useSelector((state) =>
    state.entities.entities.resultData.find((e) => e.entityName === entityName)
  );

  // Extract columns that should be displayed based on the master configuration
  const columns = masterConfig.searchFields
    .filter((field) => field.isForSearchGrid)
    .map((field) => ({
      fieldName: field.fieldName,
      displayName: field.displayName,
      isSortable: field.isForSort,
    })); // Updated to map with display names

  //// LOGIC FOR SORTING

  // Setting initial sort field and sorting data initially based on the first sortable field
  useEffect(() => {
    const defaultSortableField = masterConfig.searchFields.find(
      (field) => field.isForSort
    );
    if (defaultSortableField) {
      setOrderBy(defaultSortableField.fieldName);
      setOrder('asc');
      sortData(defaultSortableField.fieldName, 'asc', originalRows); // Sorts data initially
    } else {
      setRows(originalRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterConfig, originalRows]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    sortData(property, isAsc ? 'desc' : 'asc');
  };

  const sortData = (property, order, data = rows) => {
    const sortedRows = [...data].sort((a, b) => {
      let valueA = a[property];
      let valueB = b[property];
      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setRows(sortedRows);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.document_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelect = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    const newSelected =
      selectedIndex === -1
        ? [...selected, id]
        : selected.filter((itemId) => itemId !== id);
    setSelected(newSelected);
  };

  // LOGIC FOR PDF VIEW
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

  // Function to open a PDF file in a new tab
  const openFileInNewTab = (byteArray, mimeType, fileName) => {
    const blob = new Blob([byteArray], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    // Open the PDF in a new tab
    // const newTab = window.open(url, '_blank');
    // if (!newTab) {
    //   alert('Failed to open new tab. Please allow pop-ups in your browser.');
    //   return;
    // }
    // Create a hidden iframe to suggest the correct filename for download
    // const iframe = document.createElement('iframe');
    // iframe.style.display = 'none';
    // iframe.src = url;
    // iframe.onload = () => {
    //   setTimeout(() => {
    //     window.URL.revokeObjectURL(url);
    //     document.body.removeChild(iframe);
    //   }, 1000);
    // };
    // Append iframe to the document
    // document.body.appendChild(iframe);

    // Create a temporary link element to suggest the correct filename for download
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = fileName;

    // Append link to the document and trigger click
    document.body.appendChild(link);
    // window.open(link.download, '_blank');
    link.click();

    // Cleanup
    document.body.removeChild(link);
  };

  // Function to handle API call and get byte array
  const fetchFile = async (documentLink) => {
    try {
      // const documentLink = 'Downloads/Testing_PDF_10MB.pdf';
      const data = await getPresignedUrl(documentLink);
      const byteArray = base64ToByteArray(data.data); // Convert base64 string to byte array
      const mimeType = data.mimeType;
      const fileName = data.filename;

      openFileInNewTab(byteArray, mimeType, fileName);
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  };
  const handleViewDocument = async (event, documentLink) => {
    event.stopPropagation();
    try {
      // Fetching the presigned URL for the PDF
      fetchFile(documentLink);
    } catch (error) {
      console.error('Error fetching presigned URL:', error);
      alert('Failed to fetch download link.');
    }
  };

  const handleDownload = async () => {
    if (selected.length > 1) {
      // open snackbar
      setOpen(true);
      // Bulk download case
      dispatch(setDownloadNotification(true));
      try {
        const response = await processBulkDownload(entityName, selected);
        console.log('Bulk download initiated:', response);
        console.log('Selected:', selected);
        dispatch(setDownloadNotification(true));
      } catch (error) {
        console.error('Error initiating bulk download:', error);
        alert('Failed to initiate bulk download.');
      }
    } else {
      alert('No documents selected for download.');
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleChangePage = (newPage) => {
    const payload = constructPayload(searchFields);
    // validate payload
    const searchCriteria = validatePayload(payload);
    dispatch(
      fetchEntityData({
        entityName,
        page: newPage,
        size: 50,
        body: { searchCriteria },
      })
    );
  };

  const handlePreviousClick = () => {
    if (pageDetails.number > 0) {
      handleChangePage(pageDetails.number - 1);
    }
  };

  const handleNextClick = () => {
    if (pageDetails.number < pageDetails.totalPages) {
      handleChangePage(pageDetails.number + 1);
    }
  };

  // get documentLink of each row
  const getDocumentLink = (row) => {
    return row.Document_Link || row.DOCUMENT_LINK || row.documentLink;
  };

  if (loading) return <CircularProgress />;
  if (error) {
    return (
      <Card sx={{ minWidth: 275, textAlign: 'center', my: 2 }}>
        <CardContent>
          <Typography color="error" variant="body2">
            Error: {error?.message || 'Something went wrong!'}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  if (pageDetails?.totalElements === 0) return <NoDataCard />;
  if (rows.length === 0) return;

  return (
    <>
      <PaperLayout>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          width="100%"
        >
          <Typography>
            <span style={{ color: 'red' }}>*</span>Top <strong>500</strong>{' '}
            records will be displayed
          </Typography>
          <Button
            startIcon={<DownloadIcon color={'white'} width={'12px'} />}
            variant="contained"
            color="primary"
            onClick={handleDownload}
            disabled={selected.length < 2}
            sx={{ m: '6px' }}
          >
            Download
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8F8F8' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < rows.length
                    }
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    textTransform: 'none',
                    fontSize: '15px',
                    fontWeight: '700',
                    textAlign: 'center',
                  }}
                >
                  Download
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.displayName}
                    sortDirection={orderBy === column.fieldName ? order : false}
                    sx={{
                      textTransform: 'none',
                      '&.MuiTableCell-root': {
                        textTransform: 'none',
                      },
                      fontSize: '15px',
                      fontWeight: '700',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      // textOverflow: 'ellipsis',
                      // maxWidth: 160,
                      minWidth: 180,
                    }}
                  >
                    {/* Conditionally render TableSortLabel only if sorting is enabled */}
                    {column.isSortable ? (
                      <TableSortLabel
                        active={orderBy === column.fieldName}
                        direction={orderBy === column.fieldName ? order : 'asc'}
                        onClick={() => handleRequestSort(column.fieldName)}
                        sx={{ width: '20px', color: 'red', padding: '1' }}
                      >
                        {column.displayName}
                      </TableSortLabel>
                    ) : (
                      column.displayName
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.document_id}
                  hover
                  onClick={(event) => handleSelect(event, row.document_id)}
                  selected={selected.includes(row.document_id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.document_id)}
                      sx={{
                        color: 'grey',
                        '&.Mui-checked': {
                          color: '#4a4a4a',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(74, 74, 74, 0.04)',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {/* View icon button */}
                    <Button
                      onClick={(event) =>
                        handleViewDocument(event, getDocumentLink(row))
                      }
                    >
                      <DownloadFileIcon/>
                    </Button>
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={`${column.displayName}-${row.document_id}`}
                      sx={{
                        fontWeight: '500',
                        color: '#190134',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row[column.fieldName]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="flex-end">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handlePreviousClick}
            disabled={pageDetails.number === 0} // Disable if first page
            sx={{ m: 1 }}
          >
            Previous
          </Button>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={handleNextClick}
            disabled={pageDetails.number + 1 === pageDetails.totalPages} // Disable if last page
            sx={{ m: 1 }}
          >
            Next
          </Button>
        </Box>
      </PaperLayout>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Download initiated! Check download page for status
        </Alert>
      </Snackbar>
    </>
  );
}

export default DynamicTable;
