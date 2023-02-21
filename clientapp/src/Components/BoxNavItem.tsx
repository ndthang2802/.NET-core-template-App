import { Box, Grid, Typography } from '@mui/material';
import * as React from 'react';

export interface IBoxNavItemProps {
    Icon : React.ReactElement,
    FirstText : string,
    SecondText : string
}

export function BoxNavItem (props : IBoxNavItemProps) {
    var icon_ =  React.cloneElement(props.Icon, {className : 'AppBoxNavIcon'})
    
    
    return (
        <Box className="AppBoxNav">
            <Grid container spacing={0.5}   style={{ height : '100%'}}>
                <Grid item md={3.5} style={{padding : '.9rem 0.7rem 0.5rem 0.875rem', display : 'flex', justifyContent : 'center'}}>
                    {icon_}
                </Grid>
                <Grid item md={8.5} style={{ display : 'flex', flexDirection : 'column', height : '100%', justifyContent : 'center'}}>
                    <Typography style={{ fontWeight : 900, fontSize : 16, lineHeight : '32px'}} variant="caption" display='block' gutterBottom>
                        {props.FirstText}
                    </Typography>
                    <Typography style={{ fontWeight : 200, fontSize : 14, lineHeight: 0}} variant="subtitle2" gutterBottom>
                        {props.SecondText}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
  
}
