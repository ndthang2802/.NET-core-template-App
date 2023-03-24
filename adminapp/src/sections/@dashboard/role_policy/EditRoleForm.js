import { useForm, Controller } from "react-hook-form";
import { FormLabel, TextField, Box, Button, FormControl,InputLabel,Input, FormHelperText, MenuItem , Chip, OutlinedInput, Select } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { EditRole , roleSelector, setFinishEditRole } from "features/role_policy/role_policySlice";

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

export default function EditRoleForm(props) {
  const theme = useTheme();
  const { openEditRoleForm,setOpenEditRoleForm } = props;
  const { handleSubmit, formState: { errors }, setValue , watch ,control, reset } = useForm({
    defaultValues:  useMemo(() => {
      return props.values;
    }, [props])
  });

  useEffect(() => {
    reset(props.values);
  }, [props.values]);

  const dispatch = useAppDispatch();
  const { EditRoleState , EditRoleErrors }  = useSelector(roleSelector);
  const { currentUser, level }  = useSelector(authSelector);
  
  const handleClose = () => {
    setOpenEditRoleForm(false);
    dispatch(setFinishEditRole());
  }
  
  const onSubmit = data => {
    if (data){
        dispatch(EditRole(data));
    }
  };

  useEffect(() => {
    if (EditRoleState === 'pending')
    {
        setOpenMessage({...openMessage, open : true, severity : "info", message : "Pending request"})
    }
    else if (EditRoleState === "success")
    {
        setOpenMessage({...openMessage, open : true, severity : "success", message : "Edit role success!"})
    }
    else if (EditRoleState === "fail")
    {
        setOpenMessage({...openMessage, open : true, severity : "error", message : "An error occured, edit role fail!"})
    }
    
  }, [EditRoleState])

  useEffect(()=>{
    dispatch(setFinishEditRole())
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
    dispatch(setFinishEditRole())
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValue("policies",
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value, true
    );
  };



  function getStyles(name, Policies, theme) {
    return {
      fontSize : 12 ,

      fontWeight:
        Policies?.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }



  return (
    <>
    <MessageLog openMessage={openMessage} handleCloseMessage={handleCloseMessage} />
    <Modal
        open = {openEditRoleForm}
        onClose={handleClose}
        
    >
        <Box p={3} component='form' onSubmit={handleSubmit(onSubmit)} style={style}>
        <FormLabel >EDIT ROLE </FormLabel>
        <FormControl fullWidth />
        <FormControl sx={{ my : 3 , px : 3, width : '46ch'}} required >
                <InputLabel>Code: </InputLabel>
                <Controller
                    name="code"
                    control={control}
                    rules={{ required: true , pattern : {value : /^[A-Za-z0-9_-]{5,30}$/ , message: "Invalid code"} }}
                    render={({ field }) => <Input {...field} error={errors.code}   />}
                />
                <FormHelperText error={errors.code !== undefined || EditRoleErrors?.Code !== undefined} >{errors?.code?.message || (EditRoleErrors?.Code && EditRoleErrors?.Code[0])  }</FormHelperText>
            </FormControl>
        <FormControl sx={{ my : 3, px : 2, width : '26ch' }}  required  >
            <InputLabel>Level: </InputLabel>
            <Controller
                    name="level"
                    control={control}
                    rules={{ required: true ,validate :  (v) => v > level, message: "Invalid level" }}
                    render={({ field }) => <Input type="number" {...field} error={errors.level}   />}
                />
              <FormHelperText error={errors.level !== undefined || EditRoleErrors?.level !== undefined} >{errors?.level?.message || (EditRoleErrors?.level && EditRoleErrors?.level[0]) }</FormHelperText>
        </FormControl >
        <FormControl sx={{ m : 2, pr : 5 }} fullWidth required margin='dense' >
            <Controller
                    name="description"
                    control={control}
                    rules={{ required: true, maxLength : 200, message: "Invalid description" }}
                    render={({ field }) => <TextField label='Description'   {...field} error={errors.description} multiline minRows={5}  />}
                />
              <FormHelperText error={errors.description !== undefined || EditRoleErrors?.description !== undefined} >{errors?.description?.message || (EditRoleErrors?.description && EditRoleErrors?.description[0]) }</FormHelperText>
        </FormControl >
        <Controller
                    name="policies"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => 
                          <FormControl sx={{  m : 2 , pr : 5 }} fullWidth>
                            <InputLabel id="policy-select-label">Policies</InputLabel>
                            <Select
                              {...field}
                              labelId="policy-select-label"
                              label='Policies'
                              id="policy-select"
                              multiple
                              //value={Policies}
                              onChange={handleChange}
                              input={<OutlinedInput  id="policy-select" label="Policies" />}
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value, idx) => (
                                    <Chip key={idx} style={{ fontSize : 12}} label={value} />
                                  ))}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                            >
                              {
                              currentUser?.policies?.map((name, idx) => (
                                <MenuItem
                                  key={idx}
                                  value={name}
                                  style={getStyles(name, watch("policies"), theme)}
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