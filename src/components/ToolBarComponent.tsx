import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {  Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

interface Props{
    value: number,
    changeTabValue: void,
}

const ToolBarComponent = (props:any) => {

  return (
    <AppBar position="static" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Tabs value={props.value} onChange={props.changeTabValue}>
                <Tab label={"table"} value={0}></Tab>
                <Tab label={"chart"} value={1}></Tab>
          </Tabs>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ToolBarComponent;