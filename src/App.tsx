import  { useState , useEffect } from 'react';
import DatePickerComponent from './components/DatePickerComponent';
import './App.css';
import DataGridDemo from './components/DataGridComponent';
import axios from "axios";
import Box from '@mui/material/Box';
import ChartComponent from './components/ChartComponent';
import ToolBarComponent from './components/ToolBarComponent';
import { Data, DateScope } from './types';
import DataGridComponent from './components/DataGridComponent';


function App() {
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateUpTo, setDateUpTo] = useState<Date | null>(null);
  const [data, setData] = useState<Data[]>([]);
  const [tabValue, setTabValue] = useState<Number>(0);
  const [countriesList, setCountriesList] = useState<string[]>([]);


  useEffect(() => {
      fetchData();
  },[])

  async function fetchData(){
      const responce = await axios.get("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/");

      getCountries(responce.data.records);
      setData(responce.data.records);
  }

  const getDateScope = (data:Data[]) =>{
      const allDate = data.map((item:Data) =>{
        return new Date(Number(item.year), Number(item.month)-1, Number(item.day));
      }).sort((a:any,b:any) => {
          return a - b;
      })
      const dateScope: DateScope = {minDate: allDate.shift(), maxDate: allDate.pop()}
      return dateScope;
  }

  const onTabChange = (event:any , newValue:number) => {
      setTabValue(newValue);
  }

  const getCountries = (records:Data[]) => {
      const contries:string[] = ["Все страны"];

      for (let item of records){
          if (!contries.length || !(item.countriesAndTerritories == contries.at(-1))){
                const newCountry = item.countriesAndTerritories;
              
                contries.push(newCountry);
          }
      }
      setCountriesList(contries);
  }
  const sortData = () => {
      const dataCopy = [...data];
      const sortedData = dataCopy.sort((a:any,b:any) =>{
          const aDate:any = new Date(a.year, a.month-1, a.day);
          const bDate:any = new Date(b.year, b.month-1, b.day);
          return aDate - bDate;
      })
      return sortedData;
}


  return (
      <div className="App-wrapper">
        <div className='App'>
          <DatePickerComponent 
              dateFrom={dateFrom} 
              dateUpTo={dateUpTo} 
              changeDateFrom={(newValue:Date) => {setDateFrom(newValue)}} 
              changeDateUpTo={(newValue:Date) => {setDateUpTo(newValue)}}
              dateScope={getDateScope(data)}
          />
          <ToolBarComponent
              value={tabValue}
              changeTabValue={onTabChange}
          />
          <Box>
              <Box role={"tabpanel"} hidden={tabValue !== 0}>
                  {tabValue === 0 && <DataGridComponent
                      data={data}
                      dateFrom={dateFrom || getDateScope(data).minDate}
                      dateUpTo={dateUpTo || getDateScope(data).maxDate}
                      getCountries={getCountries}
                  />}
              </Box>

              <Box role={"tabpanel"} hidden={tabValue !== 1}>
                    {tabValue === 1 && <ChartComponent
                      data={sortData()}
                      dateFrom={dateFrom || getDateScope(data).minDate}
                      dateUpTo={dateUpTo || getDateScope(data).maxDate}
                      countries={countriesList}
                    />}
              </Box>
          </Box>  
      </div>
    </div>
  );
}

export default App;
