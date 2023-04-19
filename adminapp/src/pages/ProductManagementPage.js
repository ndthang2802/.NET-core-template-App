import { Helmet } from 'react-helmet-async';
import { sentenceCase } from 'change-case';
import { Fragment, useEffect, useState } from 'react';
import {Card,Table,Stack,Paper,Button,Popover,Checkbox,TableRow,MenuItem,TableBody,TableCell,Container,Typography,IconButton,TableContainer,TablePagination,Chip,ImageList,ImageListItem, ImageListItemBar, Avatar,} from '@mui/material';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { UserListToolbar } from '../sections/@dashboard/user';
import { AddProductForm } from '../sections/@dashboard/productManagement';
import { RoleTableHead } from '../sections/@dashboard/role_policy';
import { useAppDispatch } from '../app/hooks';
import { useSelector } from 'react-redux';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import LabelIcon from '@mui/icons-material/Label';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { DeleteProduct, GetImageProductLink, GetProductList, productSelector, setFinishDeleteProduct } from 'features/product/productSlice';
import MessageLog from 'sections/@dashboard/message';
import { applySortFilter, getComparator } from './common';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'center' , icon : <LabelIcon />},
  { id: 'code', label: 'Code', align: 'center', icon : <QrCode2Icon /> },
  { id: 'description', label: 'Description', width : '15%'  ,align: 'center' , icon : <LibraryBooksIcon />},
  { id: 'sellPrice', label: 'Price', align: 'center', icon : <AttachMoneyIcon /> },
  //{ id: 'inStock', label: 'Stock' ,  align: 'center', icon : <WarehouseIcon /> },
  //{ id: 'display', label: 'Appear',  align: 'center', icon : <DisplaySettingsIcon /> },
  { id: 'created', label: 'Date created', align: 'center', width : '10%',icon : <MoreTimeIcon /> },
  { id: '' },
];
export default function ProductManagementPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(15);

  const [selectProductRow,setSelectProductRow] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);

  const [openAddProductForm,setOpenAddProductForm] = useState(false);

  const dispatch = useAppDispatch();
  
  const { PRODUCTLIST, LastTimeRequestProduct, DeleteProductState } = useSelector(productSelector);
  
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTLIST.length) : 0;

  const filteredProducts = applySortFilter(PRODUCTLIST, getComparator(order, orderBy), filterName, 'name');

  const isNotFound = !filteredProducts.length && !!filterName;

  const popoveropen = Boolean(anchorEl);

  const popoverid = open ? 'simple-popover' : undefined;

  const [openMessage, setOpenMessage] = useState({
    open: false,
    message : "",
    vertical: 'top',
    horizontal: 'center',
    severity : "info"
  });
  
  useEffect(()=> {
    if (!PRODUCTLIST.length && Date.now() -  LastTimeRequestProduct  > 300){
      dispatch(GetProductList({ pageNumber : page, pageSize : rowsPerPage }));
    }
  },[PRODUCTLIST, LastTimeRequestProduct, dispatch])

  useEffect(() => {
    if (DeleteProductState === 'pending')
    {
        setOpenMessage({...openMessage, open : true, severity : "info", message : "Pending request"})
    }
    else if (DeleteProductState === "success")
    {
        setOpenMessage({...openMessage, open : true, severity : "success", message : "Add product success!"})
    }
    else if (DeleteProductState === "fail")
    {
        setOpenMessage({...openMessage, open : true, severity : "error", message : "An error occured, add product fail!"})
    }
  }, [DeleteProductState, setOpenMessage, openMessage ])

  const handleOpenMenu = (event, row) => {
    setSelectProductRow(row);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = PRODUCTLIST.map((n) => n.code);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };


  const onAddProductButtonClick = () => {
    setOpenAddProductForm(true);
  }

  const handleClickDelete = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDelete = () => {
    setAnchorEl(null);
  };
  
  const handleCloseMessage = () => {
    setOpenMessage({ ...openMessage, open: false });
    dispatch(setFinishDeleteProduct())
  };

  

  

  return (
    <>
      <MessageLog openMessage={openMessage} handleCloseMessage={handleCloseMessage} />
      <AddProductForm openAddProductForm={openAddProductForm} setOpenAddProductForm={setOpenAddProductForm} />
      <Helmet>
        <title> Product Management | Minimal UI </title>
      </Helmet>
      <Container maxWidth = 'xl'>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" style={{display: 'flex',alignItems: 'center',flexWrap: 'wrap'}} gutterBottom>
            Products Management
          </Typography>
          <Button variant="contained" onClick={onAddProductButtonClick} startIcon={<Iconify icon="eva:plus-fill" />}>
            New product
          </Button>
        </Stack>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} placeholderStr='Search product...' onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table >
                <RoleTableHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={PRODUCTLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { code, details ,name, description, sellPrice,inStock,display, imagesName,created, category } = row;
                    const selectedUser = selected.indexOf(code) !== -1;
                    return (
                      <Fragment key={index}>
                      <TableRow  hover  tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell rowSpan={2} padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, code)} />
                        </TableCell>

                        <TableCell rowSpan={2}  component="th" scope="row" padding="normal">
                          <Stack direction="column" alignItems="center" spacing={2}>
                            {/* {
                                details?.map(detail => detail.imageName).join(",")
                            } */}
                            <ImageList sx={{ width: 220, height: 220, p : 2  }} className='test' cols={1} >
                              { details?.map((item, idx) => (
                                <ImageListItem key={idx}>
                                  <img
                                    src={`${GetImageProductLink(item.imageName)}`} //?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${GetImageProductLink(item.imageName)}`} //?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item}
                                    loading="lazy"
                                  />
                                  <ImageListItemBar
                                    title={<Avatar sx={{ bgcolor: item.color, width: 25 , height: 25, mb : 1 }}  variant="square">&nbsp;</Avatar>}
                                    subtitle={item.sizes?.split(",").join(" ")}
                                  />
                                </ImageListItem>
                              ))}
                            </ImageList> 
                            
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{code}</TableCell>

                        <TableCell align="left">{description}</TableCell>


                        <TableCell align="center">
                          {sellPrice}
                        </TableCell>
                        {/* <TableCell align="center">
                          {inStock}
                        </TableCell> */}
                        {/* <TableCell align="center">
                          <Label color={display ? 'success' : 'error'}>{sentenceCase(display ? 'appear' : 'hide')}</Label>
                        </TableCell> */}
                        <TableCell align="left">{(new Date(created)).toLocaleString()}</TableCell>

                        <TableCell rowSpan={2} align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell colSpan={6} align="left">
                        <b>Categories:</b>&nbsp;&nbsp;
                        {
                          category?.split(",").map((cate,idx) => <Chip  sx={{ mr : 1}} key = {idx} color="info" label={cate} />)
                        }
                      </TableCell>
                    </TableRow>
                    </Fragment>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 15, 25]}
            component="div"
            count={PRODUCTLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Update
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={handleClickDelete}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
        <Popover
          id={popoverid}
          open={popoveropen}
          anchorEl={anchorEl}
          onClose={handleCloseDelete}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Button onClick={() => dispatch(DeleteProduct({ ProductId : selectProductRow.id})) }>Confirm</Button>
        </Popover>
      </Popover>
    </>
  );
}
