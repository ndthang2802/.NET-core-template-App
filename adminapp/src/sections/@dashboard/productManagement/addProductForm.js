import { useForm, Controller } from "react-hook-form";
import { FormLabel, TextField, Box, Button, FormControl,InputLabel,Input, FormHelperText, MenuItem , Chip, OutlinedInput, Select, Stack, Divider, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import BackspaceIcon from '@mui/icons-material/Backspace';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {  categorySelector , GetAllCategories   } from "features/Category/CategorySlice";
import DeleteIcon from '@mui/icons-material/Delete';

import { useAppDispatch } from "app/hooks";
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo, Fragment } from "react";
import MessageLog from "../message";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AddProduct, productSelector, setFinishAddProduct } from "features/product/productSlice";
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
function convertToFlatList(cateList) {
    var res = [];
    for (var i = 0; i < cateList.length ; i ++)
    {
      res.push(cateList[i])
      if (cateList[i].subCategoriesList != null){
        var x = convertToFlatList(cateList[i].subCategoriesList)
        res = res.concat(x)
      }
    }
    return res;
  }
export default function AddProductForm(props) {
  const theme = useTheme();
  const { openAddProductForm,setOpenAddProductForm } = props;
  const { handleSubmit, formState: { errors }, setValue , watch ,control, reset } = useForm({
    defaultValues: {
        images : [],
        name : "",
        description : "",
        sellPrice : 0,
        inStock : 0,
        display : true,
        category : []
    }
  });
  useEffect(() => {
    reset(props.values);
  }, [props.values]);
  const dispatch = useAppDispatch();
  const {  AddProductState ,AddProductErrors }  = useSelector(productSelector);
  const { CATEGORIESLIST, LastTimeRequestCategory} = useSelector(categorySelector);
  useEffect(()=> {
    if(!CATEGORIESLIST.length && Date.now() - LastTimeRequestCategory > 300)
    {
      dispatch(GetAllCategories());
    }
  },[CATEGORIESLIST, CATEGORIESLIST.length,  LastTimeRequestCategory, dispatch])
  const handleClose = () => {
    setOpenAddProductForm(false);
    dispatch(setFinishAddProduct());
    reset()
  }
  const onSubmit = data => {
    if (data){
        let data_ = {...data, category : data.category.join(",")}
        dispatch(AddProduct(data_));
    }
  };
  useEffect(() => {
    if (AddProductState === 'pending')
    {
        setOpenMessage({...openMessage, open : true, severity : "info", message : "Pending request"})
    }
    else if (AddProductState === "success")
    {
        setOpenMessage({...openMessage, open : true, severity : "success", message : "Add product success!"})
    }
    else if (AddProductState === "fail")
    {
        setOpenMessage({...openMessage, open : true, severity : "error", message : "An error occured, add product fail!"})
    }
  }, [AddProductState])
  useEffect(()=>{
    dispatch(setFinishAddProduct())
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
    dispatch(setFinishAddProduct())
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValue("category",
      typeof value === 'string' ? value.split(',') : value, true
    );
  };

  function getStyles(name, category, theme) {
    return {
      fontSize : 14 ,

      fontWeight:
      category?.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleCapture = async ({ target }) => {
        let files = Array.from(target.files).map((file, idx) => {
            let reader = new FileReader();
            return new Promise(resolve => {
                reader.onload = () => resolve({ id : idx, data:reader.result, name:file.name, size: file.size, type: file.type});
                reader.readAsDataURL(file);
            });
        });
        setValue('images',  await Promise.all(files), true)
    };

  const handleDeleteImages = async ({id}) => {
    console.log(id);
    setValue('images',
      [...watch('images')].filter(x => x.id != id)
      , true)
  }
  return (
    <>
    <MessageLog openMessage={openMessage} handleCloseMessage={handleCloseMessage} />
    <Modal
        open = {openAddProductForm}
        onClose={handleClose}
    >
        <Box p={3} component='form' onSubmit={handleSubmit(onSubmit)} style={style}>
        <FormLabel > <b> ADD PRODUCT </b> </FormLabel>
        <FormControl fullWidth />
        <FormControl sx={{ my : 3 , px : 3, width : '46ch'}} required >
                <InputLabel>Name: </InputLabel>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: true , pattern : {value : /^[A-Za-z0-9_-]{5,30}$/ , message: "Invalid name"} }}
                    render={({ field }) => <Input {...field} error={errors.name !== undefined}   />}
                />
                <FormHelperText error={errors.name !== undefined || AddProductErrors?.Name !== undefined} >{errors?.name?.message || (AddProductErrors?.Name && AddProductErrors?.Name[0])  }</FormHelperText>
            </FormControl>
        <FormControl sx={{ my : 3, px : 2, width : '26ch' }}  required  >
            <InputLabel>Sell Price: </InputLabel>
            <Controller
                    name="sellPrice"
                    control={control}
                    rules={{ required: true , validate : (v) => v > 0 , message: "Invalid sell price" }}
                    render={({ field }) => <Input type="number" {...field} error={errors.sellPrice !== undefined }   />}
                />
              <FormHelperText error={errors.sellPrice !== undefined || AddProductErrors?.sellPrice !== undefined} >{errors?.sellPrice?.message || (AddProductErrors?.sellPrice && AddProductErrors?.sellPrice[0]) }</FormHelperText>
        </FormControl >
        <FormControl sx={{ my : 3, px : 2, width : '36ch' }}  required  >
            <InputLabel>In stock: </InputLabel>
            <Controller
                    name="inStock"
                    control={control}
                    rules={{ required: true , validate : (v) => v > 0 , message: "Invalid sell price" }}
                    render={({ field }) => <Input type="number" {...field} error={errors.inStock !== undefined}   />}
                />
              <FormHelperText error={errors.inStock !== undefined || AddProductErrors?.inStock !== undefined} >{errors?.inStock?.message || (AddProductErrors?.inStock && AddProductErrors?.inStock[0]) }</FormHelperText>
        </FormControl >
        <FormControlLabel sx={{ my : 3, px : 2, width : '36ch', verticalAlign : 'bottom' , justifyContent : 'center' }} 
                label="Appear to user"  
                control={<Controller
                    control={control}
                    name="display"
                    render={({ value: valueProp }) => {
                    return (
                        <Switch
                        value={valueProp}
                        onChange={(event, val) => setValue(`display`, val) }
                        />
                    );
                    }}
                />}  >
            {/* <InputLabel>In stock: </InputLabel> */}
            <FormHelperText error={errors.display !== undefined || AddProductErrors?.display !== undefined} >{errors?.display?.message || (AddProductErrors?.display && AddProductErrors?.display[0]) }</FormHelperText>
        </FormControlLabel >
        <FormControl sx={{ m : 2, pr : 5 }} fullWidth required margin='dense' >
            <Controller
                    name="images"
                    control={control}
                    rules={{ required: true, maxLength : 200, message: "Invalid description" }}
                    render={({ field }) => 
                        <Stack direction='column' divider={<Divider orientation="vertical" flexItem />}>
                            <Button {...field}  variant="outlined" component='label' startIcon={<PhotoCamera />} >
                                Upload
                                <input hidden accept="image/*" multiple type="file" onChange={handleCapture} />
                            </Button>
                            <List >
                                {
                                    Array.isArray(watch("images")) && watch("images").map((image, idx) => 
                                        <Fragment key = {idx}>
                                            <ListItem 
                                            key = {idx} 
                                            alignItems="flex-start"
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteImages(image)} > 
                                                  <DeleteIcon />
                                                </IconButton>
                                              }
                                            >
                                                <ListItemAvatar>
                                                <Avatar alt={image.name} src={image.data} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primaryTypographyProps ={{fontSize: 12}} 
                                                    primary={image.name}
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </Fragment>
                                    )
                                }
                            </List>
                        </Stack>
                    }
                />
              <FormHelperText error={errors.images !== undefined || AddProductErrors?.images !== undefined} >{errors?.images?.message || (AddProductErrors?.images && AddProductErrors?.images[0]) }</FormHelperText>
        </FormControl >
        <FormControl sx={{ m : 2, pr : 5 }} fullWidth required margin='dense' >
            <Controller
                    name="description"
                    control={control}
                    rules={{ required: true, maxLength : 200, message: "Invalid description" }}
                    render={({ field }) => <TextField label='Description'   {...field} error={errors.description !== undefined} multiline minRows={5}  />}
                />
              <FormHelperText error={errors.description !== undefined || AddProductErrors?.description !== undefined} >{errors?.description?.message || (AddProductErrors?.description && AddProductErrors?.description[0]) }</FormHelperText>
        </FormControl >
        <Controller
                    name="category"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => 
                          <FormControl sx={{  m : 2 , pr : 5 }} fullWidth>
                            <InputLabel id="category-select-label">Categories</InputLabel>
                            <Select
                              {...field}
                              labelId="category-select-label"
                              label='Categories'
                              id="category-select"
                              multiple
                              onChange={handleChange}
                              input={<OutlinedInput  id="category-select" label="Categories" />}
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
                                CATEGORIESLIST && 
                                convertToFlatList(CATEGORIESLIST).map((cate, idx) => (
                                <MenuItem
                                  key={idx}
                                  value={cate.code}
                                  style={getStyles(cate.code, watch("category"), theme)}
                                >
                                  {cate.displayName}
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
            <Button variant="contained"  startIcon={<AddBusinessIcon />} disableElevation  type="submit">
                Add
            </Button>
        </FormControl>
        </Box>
    </Modal> </>
  );
}