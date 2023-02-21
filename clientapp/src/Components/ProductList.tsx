import { Box, Button, IconButton } from '@mui/material';
import * as React from 'react';
import { Product } from './Product';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ButtonGroupProps, ArrowProps, DotProps } from 'react-multi-carousel/lib/types';
interface CustomLeftArrowProps extends ArrowProps {
//   myOwnStuff: string;
}
interface CustomRightArrowProps extends ArrowProps {

}
const responsive = {
  superLargeDesktop1: {
    // the naming can be any, depends on you.
    breakpoint: { max: 1800, min: 1640 },
    items: 4
  },
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 1430 },
    items: 3
  },
  desktop1: {
    breakpoint: { max: 1430, min: 1220 },
    items: 3
  },
  desktop: {
    breakpoint: { max: 1220, min: 1015 },
    items: 2
  },
  tablet1: {
    breakpoint: { max: 1015, min: 810 },
    items: 2
  },
  tablet: {
    breakpoint: { max: 810, min: 610 },
    items: 2
  },
  mobile1: {
    breakpoint: { max: 610, min: 405 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 405, min: 0 },
    items: 1
  }
};
export interface IProductListProps {
   Products : React.ReactElement[]
}

export function ProductList (props: IProductListProps) {
    const CustomLeftArrow = ({ onClick }: CustomLeftArrowProps) => {
        return <IconButton className = "ProductListLeftButton" aria-label="ProductListback" size="large" onClick={onClick} >
                    <ArrowBackIcon fontSize="inherit" />
                </IconButton>
    }

    const CustomRightArrow = ({ onClick }: CustomRightArrowProps) => {
        return <IconButton className = "ProductListRightButton" aria-label="ProductListforward" size="large" onClick={onClick} >
                    <ArrowForwardIcon fontSize="inherit" />
                </IconButton>
    }
      
    return (
        
            <Carousel
                customLeftArrow={<CustomLeftArrow />}
                customRightArrow={<CustomRightArrow />}
                responsive={responsive}
                // showDots={true}
            >
                {props.Products}
            </Carousel>
    );
}
