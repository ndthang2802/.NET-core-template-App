import React from 'react';
import './App.css';
import {ProductList} from './Components/ProductList';
import { Product } from './Components/Product';
import CategoryMenu from './Components/CategoryMenu';
import { Box, Chip, Container, createTheme,ThemeProvider , Grid, ListItem, Paper, Stack, Typography } from '@mui/material';

const THEME = createTheme({
  typography: {
   "fontFamily": `"Roboto Mono", "monospace", "Ubuntu", sans-serif`,
   "fontWeightRegular" : 700
  }
});
interface ChipData {
  key: number;
  color : string;
  label: string;
}
function App() {

  var x  = [
            <Product key={1} ImageLink ="https://www.pngmart.com/files/22/Honedge-Pokemon-PNG-Pic.png" ProductName  = "Honedge" ProductPrice  = {1000} ProductRating ={3} ProductDiscount  = {0.5} />,
            <Product key={2} ImageLink ="https://www.pngmart.com/files/22/Arceus-Pokemon-PNG-Isolated-Photo.png" ProductName  = "Arceus" ProductPrice  ={2000} ProductRating ={5} ProductDiscount  ={ 0.8} />,
            <Product key={3} ImageLink ="https://www.pngmart.com/files/12/Stuart-Minion-PNG-Clipart.png" ProductName  = "Stuart" ProductPrice  = {700} ProductRating ={4.5} ProductDiscount  = {0.2} />,
            <Product key={4} ImageLink ="https://www.pngmart.com/files/22/Tapu-Koko-Pokemon-PNG-Isolated-Image.png" ProductName  = "Tapu-Koko" ProductPrice  = {900} ProductRating ={4.2} ProductDiscount  = {0.3} />,
            <Product key={5} ImageLink ="https://www.pngmart.com/files/22/Kricketot-Pokemon-PNG-HD-Isolated.png" ProductName  = "Kricketot" ProductPrice  = {780} ProductRating ={3.7} ProductDiscount  = {0.45} />,
            <Product key={6} ImageLink ="https://www.pngmart.com/files/22/Ludicolo-Pokemon-PNG.png" ProductName  = "Ludicolo" ProductPrice  = {100} ProductRating = {2} ProductDiscount  = {0.49} />,
            <Product key={7} ImageLink ="https://www.pngmart.com/files/22/Chespin-Pokemon-Transparent-Images-PNG.png" ProductName  = "Chespin" ProductPrice  = {200} ProductRating ={1} ProductDiscount  = {0.7} />
  ]
  const [chipData, setChipData] = React.useState<readonly ChipData[]>([
    { key: 0, color : '#4b9d6e' ,label: 'Angular' },
    { key: 1, color : '#4b9d6e' ,label: 'jQuery' },
    { key: 2, color : '#4b9d6e' ,label: 'Polymer' },
    { key: 3, color : '#4b9d6e' ,label: 'React' },
    { key: 4, color : '#4b9d6e' ,label: 'Vue.js' },
  ]);

  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };


  return (
    <ThemeProvider theme={THEME} >
        <Box  className="AppContainer" sx={{ flexGrow: 1 }}>
          <Box className='AppHeader'></Box>
          <Container maxWidth="lg">
                <Grid container spacing={0.5}>
                  <Grid item xs={6} md={3} style={{padding : "2rem 0"}}>
                    <Box className="AppBoxNav"></Box>
                  </Grid>
                  <Grid item xs={6} md={3} style={{padding : "2rem 0"}}>
                    <Box className="AppBoxNav"></Box>
                  </Grid>
                  <Grid item xs={6} md={3} style={{padding : "2rem 0"}} >
                    <Box className="AppBoxNav"></Box>
                  </Grid>
                  <Grid item xs={6} md={3} style={{padding : "2rem 0"}} >
                    <Box className="AppBoxNav"></Box>
                  </Grid>
                </Grid>
                <Grid container spacing={0.5}>
                  <Grid style={{position : 'relative'}} item xs={4} md={3}>
                      <CategoryMenu />
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Box className="ProductRowContainer">
                      <Typography style={{ fontWeight : 900, fontSize : 30,  marginBottom : 0, letterSpacing : 0}} variant="caption" display='block' gutterBottom>
                        Dariry & Eggs
                      </Typography>
                      <Typography style={{ fontWeight : 200, fontSize : 13, lineHeight: 0, marginBottom : '1.3rem', textIndent : '.5rem'}} variant="subtitle2" gutterBottom>
                        Best collection in 2023 for you!
                      </Typography>
                      <Stack style={{ padding : '.3rem 0 .7rem 0'}} direction="row" spacing={1.5}>
                        {chipData.map((data) => {
                          return (
                              <Chip
                                key={data.key}
                                style={{ backgroundColor : data.color, color : '#fff', fontWeight : 700}}
                                label={data.label}
                                onDelete={() => handleDelete(data)}
                              />
                          );
                        })}
                      </Stack>
                      <ProductList Products={x} />
                    </Box>
                    <Box className="ProductRowContainer">
                      <Typography style={{ fontWeight : 700, fontSize : 25}} variant="h4" gutterBottom>
                        The title
                      </Typography>
                      <ProductList Products={x} />
                    </Box>
                    <Box className="ProductRowContainer">
                      <Typography style={{ fontWeight : 700, fontSize : 25}} variant="h4" gutterBottom>
                        The title
                      </Typography>
                      <ProductList Products={x} />
                    </Box>
                  </Grid>
                </Grid>
          </Container>
        </Box></ThemeProvider>
  );
}

export default App;
