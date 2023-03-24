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
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DescriptionIcon from '@mui/icons-material/Description';
import PolicyIcon from '@mui/icons-material/Policy';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
// sections
import {UserListToolbar } from '../sections/@dashboard/user';
import {RoleTableHead, EditRoleForm} from '../sections/@dashboard/role_policy';
import { roleSelector, GetAllLowerRoleOfUser} from '../features/role_policy/role_policySlice';
import { useAppDispatch } from '../app/hooks';
import { useSelector } from 'react-redux';
import CachedIcon from '@mui/icons-material/Cached';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code', align: "left", icon : <VpnKeyIcon /> },
  { id: 'description', label: 'Description', align: "left" , icon : <DescriptionIcon />},
  { id: 'level', label: 'Level', align: "center" , icon : <FormatListNumberedIcon />},
  { id: 'policies', label: 'Policies', align: "center", icon : <PolicyIcon /> },
  { id: 'created', label: 'Date created', align: "left", icon : <MoreTimeIcon /> },
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
    return filter(array, (_role) => _role.code.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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

  const [openEditRoleForm,setOpenEditRoleForm] = useState(false);

  const [editRowChoose,setEditRowChoose] = useState({});

  const dispatch = useAppDispatch();

  useEffect(()=> {
    dispatch(GetAllLowerRoleOfUser());
  },[])

  const { ROLELIST } = useSelector(roleSelector);
  const handleOpenMenu = (event, row) => {
    setEditRowChoose(row);
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
      const newSelecteds = ROLELIST.map((n) => n.code);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ROLELIST.length) : 0;

  const filteredRoles = applySortFilter(ROLELIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredRoles.length && !!filterName;

  const onEditRoleButtonClick = () => {
    setOpenEditRoleForm(true);
  }

  return (
    <>
      <EditRoleForm openEditRoleForm={openEditRoleForm} setOpenEditRoleForm={setOpenEditRoleForm} values = {{...editRowChoose, policies : editRowChoose?.policies ? editRowChoose?.policies.split(",") : [] }} />
      <Helmet>
        <title> Role & Policies | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" style={{display: 'flex',alignItems: 'center',flexWrap: 'wrap'}} gutterBottom>
            Role & Policies&nbsp;&nbsp;<CachedIcon fontSize='large' onClick={()=>dispatch(GetAllLowerRoleOfUser())} style={{ cursor : 'pointer'}} />
          </Typography>
          <Button variant="contained" onClick={onEditRoleButtonClick} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Role
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
              <Table>
                <RoleTableHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={ROLELIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { id, code, description, level,created, policies } = row;
                    const selectedUser = selected.indexOf(code) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, code)} />
                        </TableCell>

                        <TableCell >
                            <Typography variant="subtitle2" noWrap>
                              {code}
                            </Typography>
                        </TableCell>

                        <TableCell width={'20%'} align="left">{description}</TableCell>

                        <TableCell align="center">{level}</TableCell>


                        <TableCell width={'30%'} align="left">
                          {/* <Label color={('success' === 'banned' && 'error') || 'success'}>{sentenceCase('success')}</Label> */}
                          {policies?.split(",").map((policy,idx) => 
                            <Label key={idx} color='success' style={{ marginRight : '.5rem', marginTop : '.5rem' }}>{sentenceCase(policy)}</Label>
                        )}
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={ROLELIST.length}
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
        <MenuItem onClick={()=> {setOpenEditRoleForm(true); handleCloseMenu() ;}}>
          <Iconify  icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}