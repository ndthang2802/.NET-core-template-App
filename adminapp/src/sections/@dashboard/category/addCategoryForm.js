import { useForm, Controller } from "react-hook-form";
import { FormLabel, TextField, Box, Button, FormControl,InputLabel,Input, FormHelperText, MenuItem , OutlinedInput, Select } from "@mui/material";
import Modal from '@mui/material/Modal';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { AddCategory , categorySelector , setFinishAddCategory } from "features/Category/CategorySlice";
import { useAppDispatch } from "app/hooks";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MessageLog from "../message";
import BackspaceIcon from '@mui/icons-material/Backspace';
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
export default function AddCategoryForm(props) {
  const { openAddCategoryForm,setOpenAddCategoryForm } = props;
  const { handleSubmit, formState: { errors }, setValue , watch ,control, reset } = useForm({
    defaultValues:  {
        code : "",
        displayName : "",
        description : "",
        parentId : 0,
    }
  });
  const dispatch = useAppDispatch();
  const { AddCategoryState , AddCategoryErrors , CATEGORIESLIST }  = useSelector(categorySelector);
  const handleClose = () => {
    setOpenAddCategoryForm(false);
    dispatch(setFinishAddCategory());
    reset();
  }
  const onSubmit = data => {
    if (data){
        dispatch(AddCategory(data));
    }
  };
  useEffect(() => {
    if (AddCategoryState === 'pending')
    {
        setOpenMessage({...openMessage, open : true, severity : "info", message : "Pending request"})
    }
    else if (AddCategoryState === "success")
    {
        setOpenMessage({...openMessage, open : true, severity : "success", message : "Add category success!"})
    }
    else if (AddCategoryState === "fail")
    {
        setOpenMessage({...openMessage, open : true, severity : "error", message : "An error occured, add category fail!"})
    }
  }, [AddCategoryState])
  useEffect(()=>{
    dispatch(setFinishAddCategory())
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
    dispatch(setFinishAddCategory())
  };
  const handleChange = (event) => {
    const { target: { value }, } = event;
    setValue("parentId",
      value
    );
  };
  return (
    <>
    <MessageLog openMessage={openMessage} handleCloseMessage={handleCloseMessage} />
    <Modal
        open = {openAddCategoryForm}
        onClose={handleClose}
    >
        <Box p={3} component='form' onSubmit={handleSubmit(onSubmit)} style={style}>
        <FormLabel ><b> ADD CATEOGRY </b> </FormLabel>
        <FormControl fullWidth />
        <FormControl sx={{ my : 3 , px : 3, width : '36ch'}} required >
                <InputLabel>Code: </InputLabel>
                <Controller
                    name="code"
                    control={control}
                    rules={{ required: true , pattern : {value : /^[A-Za-z0-9_-]{5,30}$/ , message: "Invalid code"} }}
                    render={({ field }) => <Input {...field} error={errors.code !== undefined || AddCategoryErrors?.Code !== undefined}   />}
                />
                <FormHelperText error={errors.code !== undefined || AddCategoryErrors?.Code !== undefined} >{errors?.code?.message || (AddCategoryErrors?.Code && AddCategoryErrors?.Code[0])  }</FormHelperText>
            </FormControl>
        <FormControl sx={{ my : 3, px : 2, width : '36ch' }}  required  >
            <InputLabel>Display name: </InputLabel>
            <Controller
                    name="displayName"
                    control={control}
                    rules={{ required: true, maxLength : 40, message: "Invalid display name" }}
                    render={({ field }) => <Input  {...field} error={errors.displayName !== undefined || AddCategoryErrors?.displayName !== undefined}   />}
                />
              <FormHelperText error={errors.displayName !== undefined || AddCategoryErrors?.displayName !== undefined} >{errors?.displayName?.message || (AddCategoryErrors?.displayName && AddCategoryErrors?.displayName[0]) }</FormHelperText>
        </FormControl >
        <FormControl sx={{ m : 2, pr : 5 }} fullWidth required margin='dense' >
            <Controller
                    name="description"
                    control={control}
                    rules={{ required: true, maxLength : 200, message: "Invalid description" }}
                    render={({ field }) => <TextField label='Description'   {...field} error={errors.description !== undefined || AddCategoryErrors?.description !== undefined} multiline minRows={5}  />}
                />
              <FormHelperText error={errors.description !== undefined || AddCategoryErrors?.description !== undefined} >{errors?.description?.message || (AddCategoryErrors?.description && AddCategoryErrors?.description[0]) }</FormHelperText>
        </FormControl >
        <Controller
                    name="parentId"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => 
                          <FormControl sx={{  m : 2 , pr : 5 }} fullWidth>
                            <InputLabel id="parentId-select-label">Parent Category</InputLabel>
                            <Select
                              {...field}
                              labelId="parentId-select-label"
                              label='Parent Category'
                              id="parentId-select"
                              onChange={handleChange}
                              input={<OutlinedInput  id="parentId-select" label="Parent Category" />}
                              MenuProps={MenuProps}
                            >
                              {
                                [{id : 0, displayName : "No parent"}].concat(CATEGORIESLIST).map((category, idx) => (
                                  <MenuItem
                                    key={idx}
                                    value={category.id}
                                  >
                                    {category.displayName}
                                  </MenuItem>
                                ))
                              }
                            </Select>
                          </FormControl>
                  }
                />
        <FormControl sx={footerStyle}  fullWidth margin='dense'>
          <Button variant="contained" onClick={() => reset()} startIcon={<BackspaceIcon />} disableElevation color='error' >
                Clear
            </Button>
            <Button variant="contained"  startIcon={<PublishedWithChangesIcon />} disableElevation  type="submit">
                Add
            </Button>
        </FormControl>
        </Box>
    </Modal> </>
  );
}