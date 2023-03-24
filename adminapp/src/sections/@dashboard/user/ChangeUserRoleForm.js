import { useForm, Controller } from "react-hook-form";
import { FormLabel, TextField, Box, Button, FormControl,InputLabel,Input, FormHelperText, MenuItem , Chip, OutlinedInput, Select } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import {  roleSelector } from "features/role_policy/role_policySlice";
import { ChangeUserRole , userSelector, setFinishChangeUserRole } from "features/user/useSlice";



import {  authSelector   } from "features/auth/authSlice";

import { useAppDispatch } from "app/hooks";
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import MessageLog from "../message";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    backgroundColor: '#f5f5f5',
    boxShadow: 24,
    p: 4,
  };
const footerStyle = {
    my : 3,
    px : 3,
    display : 'flex' , 
    flexDirection : 'row', 
    gap : '1rem',
    justifyContent : 'flex-end'
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function ChangeUserRoleForm(props) {
  const theme = useTheme();
  const { openChangeUserRoleForm,setOpenChangeUserRoleForm } = props;
  const { handleSubmit, formState: { errors }, setValue , watch ,control, reset } = useForm({
    defaultValues:  useMemo(() => {
      return props.values;
    }, [props])
  });

  useEffect(() => {
    reset(props.values);
  }, [props.values]);

  const dispatch = useAppDispatch();
  const {  ROLELIST }  = useSelector(roleSelector);
  const { ChangeUserRoleState }  = useSelector(userSelector);

  //const { currentUser, level }  = useSelector(authSelector);
  
  const handleClose = () => {
    setOpenChangeUserRoleForm(false);
    dispatch(setFinishChangeUserRole());
  }
  
  const onSubmit = data => {
    if (data){
        let fetchdata = {
            userId : data.id,
            roles : data.roles.join(",")
        }
        dispatch(ChangeUserRole(fetchdata));
    }
  };


  useEffect(() => {
    if (ChangeUserRoleState === 'pending')
    {
        setOpenMessage({...openMessage, open : true, severity : "info", message : "Pending request"})
    }
    else if (ChangeUserRoleState === "success")
    {
        setOpenMessage({...openMessage, open : true, severity : "success", message : "Assign role success!"})
    }
    else if (ChangeUserRoleState === "fail")
    {
        setOpenMessage({...openMessage, open : true, severity : "error", message : "An error occured, assign role fail!"})
    }
    
  }, [ChangeUserRoleState])

  useEffect(()=>{
    dispatch(setFinishChangeUserRole())
  }, [watch])


  const [openMessage, setOpenMessage] = useState({
    open: false,
    message : "",
    vertical: 'top',
    horizontal: 'center',
    severity : "info"
  });


  const handleCloseMessage = () => {
    setOpenMessage({ ...openMessage, open: false });
    dispatch(setFinishChangeUserRole())
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValue("roles",
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value, true
    );
  };





  function getStyles(name, Roles, theme) {
    return {
      fontSize : 14 ,

      fontWeight:
        Roles?.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }



  return (
    <>
    <MessageLog openMessage={openMessage} handleCloseMessage={handleCloseMessage} />
    <Modal
        open = {openChangeUserRoleForm}
        onClose={handleClose}
        
    >
        <Box p={3} component='form' onSubmit={handleSubmit(onSubmit)} style={style}>
        <FormLabel ><b>CHANGE USER ROLES</b>  </FormLabel>
        <FormControl fullWidth />
        <FormControl sx={{ ml : 2, my : 2, width : '18ch' }} required  >
            <TextField label='Username' value={props?.values?.username} disabled />
        </FormControl >
        <FormControl sx={{ my: 2, ml :  1 ,  width : '15ch' }}  required >
            <TextField label='Phone' value={props?.values?.phoneNumber} disabled   />
        </FormControl>
        <FormControl sx={{ m : 2 , width : '33ch' }}  required >
            <TextField label='E-mail' value={props?.values?.email} disabled   />
        </FormControl>
        <Controller
                    name="roles"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => 
                          <FormControl sx={{  m : 2 , pr : 5 }} fullWidth>
                            <InputLabel id="role-select-label">Roles</InputLabel>
                            <Select
                              {...field}
                              labelId="role-select-label"
                              label='Roles'
                              id="role-select"
                              multiple
                              onChange={handleChange}
                              input={<OutlinedInput  id="role-select" label="Roles" />}
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value, idx) => (
                                    <Chip key={idx} style={{ fontSize : 14}} label={value} />
                                  ))}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                            >
                              {
                              ROLELIST?.map(x => x.code).map((name, idx) => (
                                <MenuItem
                                  key={idx}
                                  value={name}
                                  style={getStyles(name, watch("roles"), theme)}
                                >
                                  {name}
                                </MenuItem>
                              ))
                              }
                            </Select>
                          </FormControl>
                  }
                />
        <FormControl sx={footerStyle}  fullWidth margin='dense'>
            <Button variant="contained"  startIcon={<PublishedWithChangesIcon />} disableElevation  type="submit">
                Change
            </Button>
        </FormControl>
        </Box>
    </Modal> </>
  );
}