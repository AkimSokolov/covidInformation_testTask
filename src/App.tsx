import React, { useState , useEffect } from 'react';
import DatePickerComponent from './components/DatePickerComponent';
import './App.css';
import Button from "mui-button";
import { Dayjs } from 'dayjs';
import DataGridDemo from './components/DataGridComponent';
import axios from "axios";
import Box from '@mui/material/Box';
import ChartComponent from './components/ChartComponent';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import ToolBarComponent from './components/ToolBarComponent';
import Chartist from "react-chartist";





function App() {
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateUpTo, setDateUpTo] = useState<Dayjs | null>(null);
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("chart");
  const [tabValue, setTabValue] = useState(0);


  useEffect(() => {
    fetchData();
  },[])

  async function fetchData(){
    const responce = await axios.get("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/")
    setData(responce.data.records);
  }

  const getDateScope = (data:any) =>{
      const allDate = data.map((item:any) =>{
        return new Date(item.year, item.month-1, item.day);
      }).sort((a:any,b:any) => {
          return a - b;
      })
      return {minDate: allDate.shift(), maxDate: allDate.pop()};
  }

  const onTabChange = (event:any , newValue:any) => {
    setTabValue(newValue);
  }

  // const getChart = () => {
  //   return new Chartist.Line('.ct-chart', {
  //     labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  //     series: [
  //       [12, 9, 7, 8, 5],
  //       [2, 1, 3.5, 7, 3],
  //       [1, 3, 4, 5, 6]
  //     ]
  //   }, {
  //     fullWidth: true,
  //     chartPadding: {
  //       right: 40
  //     }
  //   });
  // }

  return (
    <div className="App-wrapper">
      <div className='App'>
        <DatePickerComponent 
          dateFrom = {dateFrom} 
          dateUpTo = {dateUpTo} 
          changeDateFrom = {(newValue:any) => {setDateFrom(newValue)}} 
          changeDataUpTo = {(newValue:any) => {setDateUpTo(newValue)}}
          dateScope = {getDateScope(data)}
        />

        <Box>

          {/* /*<Button variant={viewMode == "table" ? "contained" : "outlined"} onClick = {() => {setViewMode("table")}}>
              Таблица
          </Button>

          <Button variant={viewMode == "chart" ? "contained" : "outlined"} onClick = {() => {setViewMode("chart")}}>
              График
          </Button>*/ }
        </Box>
        <ToolBarComponent
            value={tabValue}
            changeTabValue={onTabChange}
        />
          <Box>
                    <Box role={"tabpanel"} hidden={tabValue !== 0}>
                        {tabValue === 0 && <DataGridDemo
                            data = {data}
                            dateFrom = {dateFrom || getDateScope(data).minDate}
                            dateUpTo = {dateUpTo || getDateScope(data).maxDate}
                        />}
                    </Box>

                    <Box role={"tabpanel"} hidden={tabValue !== 1}>
                        {tabValue === 1 && <ChartComponent/>
                        }
                    </Box>
          </Box>



        {/* {viewMode == "table" ? 
        
          <DataGridDemo 
              data = {data}
              dateFrom = {dateFrom || getDateScope(data).minDate}
              dateUpTo = {dateUpTo || getDateScope(data).maxDate}
          />  
        : 
          <ChartComponent/>
   
        } */}

      </div>
    </div>
  );
}

export default App;
