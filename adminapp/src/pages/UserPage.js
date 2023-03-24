import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect,Fragment, useState } from 'react';
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
import { UserListHead, UserListToolbar, AddUserForm, ChangeUserRoleForm } from '../sections/@dashboard/user';

import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import { userSelector, GetAllUser } from '../features/user/useSlice';
import { GetAllLowerRoleOfUser, roleSelector } from '../features/role_policy/role_policySlice';

import { useAppDispatch } from '../app/hooks';
import { useSelector } from 'react-redux';
import CachedIcon from '@mui/icons-material/Cached';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'username', label: 'Username', alignRight: false, icon : <BadgeIcon /> },
  { id: 'phoneNumber', label: 'Phone', alignRight: false , icon : <PhoneIcon />},
  { id: 'address', label: 'Address', alignRight: false , icon : <BusinessIcon />},
  { id: 'email', label: 'E-mail', alignRight: false, icon : <ContactMailIcon /> },
  { id: 'created', label: 'Date created', alignRight: false, icon : <MoreTimeIcon /> },
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
    return filter(array, (_user) => _user.username.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editUserRoleRowChoose,setEditUserRoleRowChoose] = useState({});


  const [openAddUserForm,setOpenAddUserForm] = useState(false);
  const [openChangeUserRoleForm,setOpenChangeUserRoleForm] = useState(false);


  const dispatch = useAppDispatch();
  const { USERLIST } = useSelector(userSelector);
  const { ROLELIST } = useSelector(roleSelector);


  useEffect(()=> {
    if (!USERLIST.length){
      dispatch(GetAllUser());
    }
    
  },[USERLIST, USERLIST.length])

  useEffect(()=> {
    if(!ROLELIST.length)
    {
      dispatch(GetAllLowerRoleOfUser());
    }
  },[ROLELIST, ROLELIST.length])

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
      const newSelecteds = USERLIST.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const onAddUserButtonClick = () => {
    setOpenAddUserForm(true);
  }
  const onChangeUserRoleButtonClick = () => {
    setOpenChangeUserRoleForm(true);
    handleCloseMenu()
  }
  

  return (
    <>
      <AddUserForm openAddUserForm={openAddUserForm} setOpenAddUserForm={setOpenAddUserForm} />
      <ChangeUserRoleForm openChangeUserRoleForm={openChangeUserRoleForm} setOpenChangeUserRoleForm={setOpenChangeUserRoleForm} values = {{...editUserRoleRowChoose, roles : editUserRoleRowChoose?.roles ? editUserRoleRowChoose?.roles.split(",") : [] }} />
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" style={{display: 'flex',alignItems: 'center',flexWrap: 'wrap'}} gutterBottom>
            User&nbsp;&nbsp;<CachedIcon fontSize='large' onClick={()=>dispatch(GetAllUser())} style={{ cursor : 'pointer'}} />
          </Typography>
          <Button variant="contained" onClick={onAddUserButtonClick} startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { id, username, phoneNumber, address, email,roles, avatarUrl,created, isVerified } = row;
                    const selectedUser = selected.indexOf(username) !== -1;

                    return (
                      <Fragment key={id} >
                      <TableRow hover  tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell rowSpan={2} padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, username)} />
                        </TableCell>

                        <TableCell rowSpan={2} component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={username} src={`/assets/images/avatars/avatar_${index + 1}.jpg`} />
                            <Typography variant="subtitle2" noWrap>
                              {username}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{phoneNumber}</TableCell>

                        <TableCell align="left">{address}</TableCell>


                        <TableCell align="left">
                          {/* <Label color={('success' === 'banned' && 'error') || 'success'}>{sentenceCase('success')}</Label> */}
                          {email}
                        </TableCell>
                        <TableCell align="left">{(new Date(created)).toLocaleString()}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                       <TableRow hover>
                          <TableCell colSpan={5}><b>Roles:</b>&nbsp;&nbsp;{roles === "" ?  <Chip color="warning"  label={"Unassigned"} />  : roles.split(",").map((role,idx) => <Chip  sx={{ mr : 1}} key = {idx} color="info" label={role} />)}</TableCell>
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
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
