import {  Alert, CircularProgress, Snackbar } from "@mui/material";
export default function MessageLog(props) {

    const {openMessage, handleCloseMessage} = props;
  
  return (
    <Snackbar
            anchorOrigin={ { vertical: openMessage.vertical, horizontal : openMessage.horizontal } }
            open={openMessage.open}
            onClose={openMessage.severity == 'info' ? () => {} : handleCloseMessage}
            key={'openMessage'}
            autoHideDuration = {openMessage.severity == 'info' ? null : 4000}
        >
            {
                openMessage.severity == 'info' ?
                <Alert onClose={openMessage.severity == 'info' ? () => {} : handleCloseMessage} icon={  <CircularProgress />} severity="info" sx={{ width: '100%' }}>
                    {openMessage.message}
                </Alert>
                : 
                <Alert onClose={handleCloseMessage}  severity={openMessage.severity} sx={{ width: '100%' }}>
                    {openMessage.message}
                </Alert>
            }
    </Snackbar>
  );
}