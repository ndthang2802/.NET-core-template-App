import { Box, Button, IconButton } from '@mui/material';
import * as React from 'react';
import { Product } from './Product';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
export interface IProductListProps {
    Product : React.ReactElement[]
}

export function ProductList (props: IProductListProps) {
    const [displayProducts, setDisplayProducts] = React.useState<number []>([1,2,3]);
    const [direction, setDirection] = React.useState<string>("");
    
    // const moveLeft = () => {
    //     var newActive = displayProducts
    //     newActive--
    //     this.setState({
    //         active: newActive < 0 ? this.state.items.length - 1 : newActive,
    //         direction: 'left'
    //     })
    // }
    return (
      <Box className="ProductListContainer">
        <Box className="ProductListPane">
            <Product  ImageLink={"https://www.pngmart.com/files/22/Honedge-Pokemon-PNG-Pic.png"} ProductName = "Honedge" ProductPrice = {1000} ProductRating={3} ProductDiscount = {0.5} />
            <Product  ImageLink={"https://www.pngmart.com/files/22/Arceus-Pokemon-PNG-Isolated-Photo.png"} ProductName = "Arceus" ProductPrice = {2000} ProductRating={5} ProductDiscount = {0.8} />
            <Product  ImageLink={"https://www.pngmart.com/files/12/Stuart-Minion-PNG-Clipart.png"} ProductName = "Stuart" ProductPrice = {700} ProductRating={4.5} ProductDiscount = {0.2} />
        </Box>
        <IconButton className = "ProductListLeftButton" aria-label="ProductListback" size="large">
            <ArrowBackIcon fontSize="inherit" />
        </IconButton>
        <IconButton className = "ProductListRightButton" aria-label="ProductListforward" size="large">
            <ArrowForwardIcon fontSize="inherit" />
        </IconButton>
      </Box>
    );
}
