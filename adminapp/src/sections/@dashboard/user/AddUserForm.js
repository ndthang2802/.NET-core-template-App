import { useForm, Controller } from "react-hook-form";
import { FormLabel, Checkbox, Box, Button, FormControl,InputLabel,Input, FormHelperText } from "@mui/material";
import Modal from '@mui/material/Modal';
import BackspaceIcon from '@mui/icons-material/Backspace';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { AddUser , userSelector , setFinishAddUser  } from "features/user/useSlice";
import { useAppDispatch } from "app/hooks";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
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

export default function AddUserForm(props) {
  const { openAddUserForm,setOpenAddUserForm } = props;
  const { handleSubmit, formState: { errors } ,control, reset } = useForm({
    defaultValues: {
      username: "",
      phoneNumber : "",
      address : "",
      email : "",
      password : ""
    }
  });

  const dispatch = useAppDispatch();
  const { AddUserState }  = useSelector(userSelector);
  const handleClose = () => setOpenAddUserForm(false);
  
  const onSubmit = data => {
    if (data){
        dispatch(AddUser(data));
    }
  };

  useEffect(() => {
    if (AddUserState == 'pending')
    {
        setOpenMessage({...openMessage, open : true, severity : "info", message : "Pending request"})
    }
    else if (AddUserState == "success")
    {
        setOpenMessage({...openMessage, open : true, severity : "success", message : "Add user success!"})
    }
    else if (AddUserState == "fail")
    {
        setOpenMessage({...openMessage, open : true, severity : "error", message : "An error occured, add user fail!"})
    }
    dispatch(setFinishAddUser())
  }, [AddUserState])


  const [openMessage, setOpenMessage] = useState({
    open: false,
    message : "",
    vertical: 'top',
    horizontal: 'center',
    severity : "info"
  });


  const handleCloseMessage = () => {
    setOpenMessage({ ...openMessage, open: false });
  };


  return (
    <>
    <MessageLog openMessage={openMessage} handleCloseMessage={handleCloseMessage} />
    <Modal
        open = {openAddUserForm}
        onClose={handleClose}
        
    >
        <Box p={3} component='form' onSubmit={handleSubmit(onSubmit)} style={style}>
        <FormLabel >ADD USER TO SYSTEM</FormLabel>
        <FormControl sx={{ my : 3 , px : 3}} required fullWidth margin='dense' >
                <InputLabel>Username: </InputLabel>
                <Controller
                    name="username"
                    control={control}
                    rules={{ required: true , pattern : {value : /^[A-Za-z0-9_-]{5,15}$/ , message: "Invalid username"} }}
                    render={({ field }) => <Input {...field} error={errors.username}   />}
                />
                <FormHelperText error={errors.username != undefined} >{errors?.username?.message}</FormHelperText>
            </FormControl>
        <FormControl sx={{ my : 3 , px : 3, width : '36ch' }}  required >
            <InputLabel>Phone: </InputLabel>
            <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ required: true, pattern : {value : /(84|0[3|5|7|8|9])+([0-9]{8})\b/ , message: "Invalid phone number" }}}
                    render={({ field }) => <Input {...field} error={errors.phoneNumber}  />}
                />
            <FormHelperText error={errors.phoneNumber != undefined} >{errors?.phoneNumber?.message}</FormHelperText>
        </FormControl>
        <FormControl sx={{ my : 3, px : 2, width : '36ch' }} required >
            <InputLabel>Email: </InputLabel>
            <Controller
                    name="email"
                    control={control}
                    rules={{ required: true, pattern : { value : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ , message : "Invalid email address" } }}
                    render={({ field }) => <Input {...field} error={errors.email}  />}
                />
            <FormHelperText error={errors.email != undefined } >{errors?.email?.message}</FormHelperText>
        </FormControl >
        <FormControl sx={{ my : 3, px : 3 }} fullWidth required margin='dense' >
            <InputLabel>Address: </InputLabel>
            <Controller
                    name="address"
                    control={control}
                    rules={{ required: true, maxLength : 200 }}
                    render={({ field }) => <Input {...field} error={errors.address}  />}
                />
        </FormControl >
        <FormControl sx={{ my : 3, px : 3 }} fullWidth required margin='dense' >
            <InputLabel>Password: </InputLabel>
            <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Input {...field} error={errors.password}  />}
                />
        </FormControl >
        <FormControl sx={footerStyle}  fullWidth margin='dense'>
            <Button variant="contained" onClick={() => reset()} startIcon={<BackspaceIcon />} disableElevation color='error' >
                Clear
            </Button>
            <Button variant="contained"  startIcon={<PersonAddIcon />} disableElevation  type="submit">
                Add
            </Button>
        </FormControl>
        </Box>
    </Modal> </>
  );
}