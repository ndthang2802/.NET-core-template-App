import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Box } from '@mui/system';
import { Chip } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
export interface IProductProps {
    ImageLink : string,
    ProductName: string,
    ProductPrice : number,
    ProductDiscount: number,
    ProductRating : number,
}


export function Product (props: IProductProps) {
  return (
        <Paper elevation={2}
            style = {{
                minWidth: '220px',
                maxWidth : '240px',
                minHeight : '290px',
                maxHeight : '390px'
            }}
            className={"ProductContainer"}
        >
            <Box
                style = {{
                    backgroundColor : "#efefef",
                    padding : '.5rem',
                }}
            >
                {props.ProductDiscount != 0 ? <Chip className='ChipDiscount' style={{ backgroundColor : '#D23F57', color : 'white'}} label={`${props.ProductDiscount*100}% off`}  /> : null}
                <a
                    style={{
                        display : 'flex',
                        flexDirection : 'column',
                        justifyContent : 'center',
                        padding : '0.5rem',
                    }}
                    className = "ProductImageContainer"
                >
                    <img
                        src={`${props.ImageLink}`}
                        srcSet={`${props.ImageLink} 2x`}
                        alt={"Bird"}
                        loading="lazy"
                    />
                    <Box className= "productExtendOverlay">
                        <Box className = "productExtendContainer" >
                            <Box>
                                <IconButton  aria-label="add to shopping cart">
                                    <RemoveRedEyeIcon className="ProductEnxtendIcon" />
                                </IconButton>
                            </Box>
                            <Box className="left-right-border">
                                <IconButton aria-label="add to shopping cart">
                                    <FavoriteBorderIcon className="ProductEnxtendIcon" />
                                </IconButton>
                            </Box>
                            <Box>
                                <IconButton aria-label="add to shopping cart">
                                    <AddIcon className="ProductEnxtendIcon" />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </a>
            </Box>
            <Box
                style = {{
                    padding : '1rem',
                    display : 'flex',
                    flexDirection : 'row',
                    justifyContent : 'space-between'
                }}
            >
                <Box
                        style={{color : '#D23F57'}}
                >
                    <a>
                         <Typography variant="subtitle2" style={{fontWeight : 700}}  gutterBottom>
                            {props.ProductName} 
                        </Typography>
                    </a>
                    <Rating name="size-small" value={props.ProductRating} size="small" />
                        <Box
                            style = {{
                                display : 'flex',
                                flexDirection : 'row',
                                gap : '1rem'
                            }}
                        >
                            <Typography variant="button" display="block" gutterBottom
                                style={{
                                    textAlign : 'center',
                                    fontWeight : 700
                                }}
                            >
                                {`₫${props.ProductPrice * ( props.ProductDiscount != 0 ? props.ProductDiscount : 1)}`}
                            </Typography>
                            <Typography variant="button" display="block" gutterBottom
                                style = {{ textDecoration : 'line-through', color : '#7D879C'}}
                            >
                                {`₫${props.ProductPrice}`}
                            </Typography>
                        </Box>
                </Box>
                <Box
                    style = {{
                        display : 'flex',
                        flexDirection : 'column-reverse'
                    }}
                >
                    <IconButton color="primary" aria-label="add to shopping cart">
                                <AddShoppingCartIcon />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
  );
}
