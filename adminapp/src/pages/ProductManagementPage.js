import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Chip,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import BadgeIcon from '@mui/icons-material/Badge';
// sections
import { UserListToolbar, AddUserForm, ChangeUserRoleForm } from '../sections/@dashboard/user';
import { AddProductForm } from '../sections/@dashboard/productManagement';

import { RoleTableHead } from '../sections/@dashboard/role_policy';


import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import { userSelector, GetAllUser } from '../features/user/useSlice';
import { GetAllLowerRoleOfUser, roleSelector } from '../features/role_policy/role_policySlice';

import { useAppDispatch } from '../app/hooks';
import { useSelector } from 'react-redux';
import CachedIcon from '@mui/icons-material/Cached';

import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

import QrCode2Icon from '@mui/icons-material/QrCode2';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import LabelIcon from '@mui/icons-material/Label';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import CategoryIcon from '@mui/icons-material/Category';
// ----------------------------------------------------------------------
function randomDate(date1, date2){
    function randomValueBetween(min, max) {
      return Math.random() * (max - min) + min;
    }
    var date1 = date1 || '01-01-1970'
    var date2 = date2 || new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if( date1>date2){
        return new Date(randomValueBetween(date2,date1)).toLocaleDateString()   
    } else{
        return new Date(randomValueBetween(date1, date2)).toLocaleDateString()  

    }
}
const PRODUCT_NAME = [
    'Nike Air Force 1 NDESTRUKT',
    'Nike Space Hippie 04',
    'Nike Air Zoom Pegasus 37 A.I.R. Chaz Bear',
    'Nike Blazer Low 77 Vintage',
    'Nike ZoomX SuperRep Surge',
    'Zoom Freak 2',
    'Nike Air Max Zephyr',
    'Jordan Delta',
    'Air Jordan XXXV PF',
    'Nike Waffle Racer Crater',
    'Kyrie 7 EP Sisterhood',
    'Nike Air Zoom BB NXT',
    'Nike Air Force 1 07 LX',
    'Nike Air Force 1 Shadow SE',
    'Nike Air Zoom Tempo NEXT%',
    'Nike DBreak-Type',
    'Nike Air Max Up',
    'Nike Air Max 270 React ENG',
    'NikeCourt Royale',
    'Nike Air Zoom Pegasus 37 Premium',
    'Nike Air Zoom SuperRep',
    'NikeCourt Royale',
    'Nike React Art3mis',
    'Nike React Infinity Run Flyknit A.I.R. Chaz Bear',
  ];
  const PRODUCT_COLOR = ['#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107'];
  const CATEGORIES = ["STANDARDSHOES", "NIKESHOES", "AUTHSHOES"]
  const PRODUCTLIST = [...Array(24)].map((_, index) => {
    const setIndex = index + 1;
  
    return {
      id : setIndex,
      code: "AAAAAAAAAAAAAAA",
      imgLink: `/assets/images/products/product_${setIndex}.jpg`,
      name: PRODUCT_NAME[index],
      description :  PRODUCT_NAME[index] + 'is very popular',
      sellPrice: faker.datatype.number({ min: 4, max: 99, precision: 0.01 }),
      inStock :  faker.datatype.number({ min: 5, max: 50 }), 
        //   priceSale: setIndex % 3 ? null : faker.datatype.number({ min: 19, max: 29, precision: 0.01 }),
    //   colors:
    //     (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
    //     (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
    //     (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
    //     (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
    //     (setIndex === 23 && PRODUCT_COLOR.slice(4, 6)) ||
    //     (setIndex === 24 && PRODUCT_COLOR.slice(5, 6)) ||
    //     PRODUCT_COLOR,
      display : true,
      purchasedCount : faker.datatype.number({ min: 5, max: 50 }),
      numberSoldCount : faker.datatype.number({ min: 50, max: 100 }),
      discount : faker.datatype.number({ min: 0, max: 1, precision: 0.01 }),
      category : CATEGORIES[setIndex % 3],
      created : randomDate('01/01/2023', '03/29/2023'),
      status: sample(['sale', 'new', '', '']),
    };
  });



const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'center' , icon : <LabelIcon />},
  { id: 'code', label: 'Code', align: 'center', icon : <QrCode2Icon /> },
  { id: 'description', label: 'Description', width : '15%'  ,align: 'center' , icon : <LibraryBooksIcon />},
  { id: 'sellPrice', label: 'Price', align: 'center', icon : <AttachMoneyIcon /> },
  { id: 'inStock', label: 'Stock' ,  align: 'center', icon : <WarehouseIcon /> },
  { id: 'display', label: 'Appear',  align: 'center', icon : <DisplaySettingsIcon /> },
  { id: 'category', label: 'Category', align: 'center', icon : <CategoryIcon /> },
  { id: 'created', label: 'Date created', align: 'center', width : '10%',icon : <MoreTimeIcon /> },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProductManagementPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [editUserRoleRowChoose,setEditUserRoleRowChoose] = useState({});


  const [openAddProductForm,setOpenAddProductForm] = useState(false);
  const [openChangeUserRoleForm,setOpenChangeUserRoleForm] = useState(false);


  const dispatch = useAppDispatch();
  const { USERLIST, LastTimeRequest } = useSelector(userSelector);
  const { ROLELIST, LastTimeRequestRole } = useSelector(roleSelector);


  useEffect(()=> {
    if (!USERLIST.length && Date.now() -  LastTimeRequest  > 300){
      dispatch(GetAllUser());
    }
    
  },[USERLIST, USERLIST.length, LastTimeRequest])

  useEffect(()=> {
    if(!ROLELIST.length && Date.now() - LastTimeRequestRole > 300)
    {
      dispatch(GetAllLowerRoleOfUser());
    }
  },[ROLELIST, ROLELIST.length, LastTimeRequestRole])

  const handleOpenMenu = (event, row) => {
    setEditUserRoleRowChoose(row);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTLIST.length) : 0;

  const filteredUsers = applySortFilter(PRODUCTLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const onAddProductButtonClick = () => {
    setOpenAddProductForm(true);
  }
  const onChangeUserRoleButtonClick = () => {
    setOpenChangeUserRoleForm(true);
    handleCloseMenu()
  }
  

  return (
    <>
      <AddProductForm openAddProductForm={openAddProductForm} setOpenAddProductForm={setOpenAddProductForm} />
      <ChangeUserRoleForm openChangeUserRoleForm={openChangeUserRoleForm} setOpenChangeUserRoleForm={setOpenChangeUserRoleForm} values = {{...editUserRoleRowChoose, roles : editUserRoleRowChoose?.roles ? editUserRoleRowChoose?.roles.split(",") : [] }} />
      <Helmet>
        <title> Product Management | Minimal UI </title>
      </Helmet>

      <Container maxWidth = 'xl'>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" style={{display: 'flex',alignItems: 'center',flexWrap: 'wrap'}} gutterBottom>
            Products Management&nbsp;&nbsp;<CachedIcon fontSize='large' onClick={()=>dispatch(GetAllUser())} style={{ cursor : 'pointer'}} />
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { id, code, name, description, sellPrice,inStock,display, imgLink,created, category } = row;
                    const selectedUser = selected.indexOf(code) !== -1;

                    return (
                      <TableRow key={index} hover  tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell  padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, code)} />
                        </TableCell>

                        <TableCell  component="th" scope="row" padding="normal">
                          <Stack direction="column" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={imgLink} variant="rounded" />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{code}</TableCell>

                        <TableCell align="left">{description}</TableCell>


                        <TableCell align="right">
                          {/* <Label color={('success' === 'banned' && 'error') || 'success'}>{sentenceCase('success')}</Label> */}
                          {sellPrice}
                        </TableCell>
                        <TableCell align="right">
                          {/* <Label color={('success' === 'banned' && 'error') || 'success'}>{sentenceCase('success')}</Label> */}
                          {inStock}
                        </TableCell>
                        <TableCell align="left">
                          <Label color={display ? 'success' : 'error'}>{sentenceCase(display ? 'appear' : 'hide')}</Label>
                        </TableCell>
                        <TableCell align="left">
                          {/* <Label color={('success' === 'banned' && 'error') || 'success'}>{sentenceCase('success')}</Label> */}
                          {category}
                        </TableCell>
                        <TableCell align="left">{(new Date(created)).toLocaleString()}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
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
        <MenuItem onClick={onChangeUserRoleButtonClick}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Change role
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
