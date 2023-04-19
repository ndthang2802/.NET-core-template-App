import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import {Card,Stack,Button,MenuItem,Container,Typography,IconButton,Divider,Tooltip,FormLabel,Input} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {categorySelector, GetAllCategories, UpdateCategory , setFinishUpdateCategory } from '../features/Category/CategorySlice';
import { useAppDispatch } from '../app/hooks';
import { useSelector } from 'react-redux';
import CachedIcon from '@mui/icons-material/Cached';
import { AddCategoryForm } from '../sections/@dashboard/category';
import { TreeItem, treeItemClasses, TreeView } from '@mui/lab';
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BackspaceIcon from '@mui/icons-material/Backspace';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import MessageLog from "../sections/@dashboard/message";
const treeViewBgColor = ['#e6f4ea', '#f3e8fd' , '#fcefe3' , '#e8f0fe']
const treeViewColor = ['#3c8039', '#a250f5' , '#e3742f' , '#1a73e8']
const style = {
    width : '50%',
    maxWidth : '60%',
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
const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
    [`& .${treeItemClasses.iconContainer}`]: {
      '& .close': {
        opacity: 0.3,
      },
    },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

function StyledTreeItem(props) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.element,
  labelText: PropTypes.string.isRequired,
};
function DisplayCateTreeView(props ){
  const {cateList, setEditCateChoose} = props
  if( cateList == null) {
    return
  }
  else {
  return <>
            {
              cateList.map(element => {
                if (element.subCategoriesList != null) {
                    return  <StyledTreeItem 
                              onClick={() => setEditCateChoose(element)}
                              key={element.id} 
                              nodeId={(element.id).toString()} 
                              labelText={element.displayName} 
                              labelIcon={LabelIcon} 
                              >
                              {
                                <DisplayCateTreeView setEditCateChoose={setEditCateChoose} cateList={element.subCategoriesList} />
                              }
                            </StyledTreeItem>
                }
                else {
                  return  <StyledTreeItem
                            onClick={() => setEditCateChoose(element)}
                            key={element.id}
                            nodeId={(element.id).toString()}
                            labelText={element.displayName}
                            labelIcon={element.parentId !== 0 ? LocalOfferIcon : LabelIcon}
                            labelInfo={<Stack direction='row'  divider={<Divider orientation="vertical" flexItem />} >
                                          <Tooltip title="delete">
                                            <IconButton>
                                              <DeleteIcon />
                                            </IconButton>
                                          </Tooltip>
                                        </Stack>
                                        }
                            color={treeViewColor[element.id % 4]}
                            bgColor={treeViewBgColor[element.id % 4]}
                          />
                }
              })
            }
          </>
  }
}
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
export default function CategoryPage() {
  const [openAddCategoryForm,setOpenAddCategoryForm] = useState(false);
  const dispatch = useAppDispatch();
  const { CATEGORIESLIST, LastTimeRequestCategory , EditCategoryState , EditCategoryError } = useSelector(categorySelector);
  useEffect(()=> {
    if(!CATEGORIESLIST.length && Date.now() - LastTimeRequestCategory > 300)
    {
      dispatch(GetAllCategories());
    }
  },[CATEGORIESLIST, CATEGORIESLIST.length,  LastTimeRequestCategory, dispatch])
  const onAddCategoryButtonClick = () => {
    setOpenAddCategoryForm(true);
  }
  const [EditCateChoose,setEditCateChoose] = useState()
  const [openMessage, setOpenMessage] = useState({
    open: false,
    message : "",
    vertical: 'top',
    horizontal: 'center',
    severity : "info"
  });
  const handleCloseMessage = () => {
    setOpenMessage({ ...openMessage, open: false });
    dispatch(setFinishUpdateCategory())
  };
  useEffect(() => {
    if (EditCategoryState === 'pending')
    {
        setOpenMessage({...openMessage, open : true, severity : "info", message : "Pending request"})
    }
    else if (EditCategoryState === "success")
    {
        setOpenMessage({...openMessage, open : true, severity : "success", message : "Add category success!"})
    }
    else if (EditCategoryState === "fail")
    {
        setOpenMessage({...openMessage, open : true, severity : "error", message : "An error occured, add category fail!"})
    }
  }, [EditCategoryState, setOpenMessage, openMessage])

  const { handleSubmit, formState: { errors }, setValue  ,control } = useForm({
      defaultValues:  {
        id : -1,
        code : "",
        displayName : "",
        description : "",
        parentId : 0,
    }
  });
  const onSubmit = data => {
    if (data){
        dispatch(UpdateCategory(data));
    }
  };

  useEffect(()=>{
    if(EditCateChoose != null)
    {
      setValue("id", EditCateChoose.id)
      setValue('code',EditCateChoose.code)
      setValue('description',EditCateChoose.description)
      setValue('displayName',EditCateChoose.displayName)
      setValue('parentId',EditCateChoose.parentId)
    }

  }, [EditCateChoose, setValue])

  
  const handleChange = (event) => {
    const { target: { value }, } = event;
    setValue("parentId",
      value
    );
  };


  return (
    <>
      <MessageLog openMessage={openMessage} handleCloseMessage={handleCloseMessage} />
      <AddCategoryForm openAddCategoryForm={openAddCategoryForm} setOpenAddCategoryForm={setOpenAddCategoryForm}  />
      <Helmet>
        <title> Categories - Product Type | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" style={{display: 'flex',alignItems: 'center',flexWrap: 'wrap'}} gutterBottom>
            Categories - Product Type&nbsp;&nbsp;<CachedIcon fontSize='large' onClick={()=>dispatch(GetAllCategories())} style={{ cursor : 'pointer'}} />
          </Typography>
          <Button variant="contained" onClick={onAddCategoryButtonClick} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Category
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <Box  sx={{  display : 'flex', flexDirection : 'row', gap : '1rem' }}>
              {
                CATEGORIESLIST?.length &&
              <TreeView
                aria-label="category"
                defaultExpanded={(convertToFlatList(CATEGORIESLIST)).map(x => x.id.toString())}
                defaultCollapseIcon={<ArrowDropDownIcon />}
                defaultExpandIcon={<ArrowRightIcon />}
                defaultEndIcon={<div style={{ width: 24 }} />}
                sx={{  flexGrow: 1, maxWidth: '40%',with :'40%', overflowY: 'auto' }}
              >
                {
                  <DisplayCateTreeView setEditCateChoose={setEditCateChoose} cateList={CATEGORIESLIST} />
                }
              </TreeView>
              }
              <Divider orientation='vertical' flexItem />
              <Box p={3} component='form' onSubmit={handleSubmit(onSubmit)} style={style}>
                <FormLabel ><b> EDIT CATEOGRY </b> </FormLabel>
                <FormControl fullWidth />
                <FormControl sx={{ my : 3 , px : 3, width : '28ch'}} required >
                        <InputLabel>Code: </InputLabel>
                        <Controller
                            name="code"
                            control={control}
                            rules={{ required: true , pattern : {value : /^[A-Za-z0-9_-]{3,30}$/ , message: "Invalid code"} }}
                            render={({ field }) => <Input  {...field} size='small' error={errors.code !== undefined || EditCategoryError?.Code !== undefined}   />}
                        />
                        <FormHelperText error={errors.code !== undefined || EditCategoryError?.Code !== undefined} >{errors?.code?.message || (EditCategoryError?.Code && EditCategoryError?.Code[0])  }</FormHelperText>
                    </FormControl>
                <FormControl sx={{ my : 3, px : 2, width : '29ch' }}  required  >
                    <InputLabel>Display name: </InputLabel>
                    <Controller
                            name="displayName"
                            control={control}
                            rules={{ required: true, maxLength : 40, message: "Invalid display name" }}
                            render={({ field }) => <Input  {...field} size='small' error={errors.displayName !== undefined || EditCategoryError?.displayName !== undefined}   />}
                        />
                      <FormHelperText error={errors.displayName !== undefined || EditCategoryError?.displayName !== undefined} >{errors?.displayName?.message || (EditCategoryError?.displayName && EditCategoryError?.displayName[0]) }</FormHelperText>
                </FormControl >
                <FormControl sx={{ m : 2, pr : 5 }} fullWidth required margin='dense' >
                    <Controller
                            name="description"
                            control={control}
                            rules={{ required: true, maxLength : 200, message: "Invalid description" }}
                            render={({ field }) => <TextField label='Description' size='small'   {...field} error={errors.description !== undefined || EditCategoryError?.description !== undefined} multiline minRows={5}  />}
                        />
                      <FormHelperText error={errors.description !== undefined || EditCategoryError?.description !== undefined} >{errors?.description?.message || (EditCategoryError?.description && EditCategoryError?.description[0]) }</FormHelperText>
                </FormControl >
                <Controller
                            name="parentId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => 
                                  <FormControl sx={{  m : 2 , pr : 5 }} fullWidth>
                                    <InputLabel id="edit-parentId-select-label">Parent Category</InputLabel>
                                    <Select
                                      {...field}
                                      labelId="edit-parentId-select-label"
                                      label='Parent Category'
                                      id="edit-parentId-select"
                                      defaultValue={0}
                                      onChange={handleChange}
                                      input={<OutlinedInput  id="edit-parentId-select" label="Parent Category" />}
                                      MenuProps={MenuProps}
                                    >
                                      {
                                        [{id : 0, displayName : "No parent"}].concat(convertToFlatList(CATEGORIESLIST)).map((category, idx) => (
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
                  <Button variant="contained" disabled={EditCateChoose == null} startIcon={<BackspaceIcon />} disableElevation color='error' >
                        Delete
                    </Button>
                    <Button variant="contained" disabled={EditCateChoose == null}  startIcon={<PublishedWithChangesIcon />} disableElevation  type="submit">
                        Change
                    </Button>
                </FormControl>
                </Box>
            </Box>
          </Scrollbar>
              
        </Card>
      </Container>

      {/* <Popover
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
      </Popover> */}
    </>
  );
}
