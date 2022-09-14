import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useState, useEffect } from 'react';
import { utimes } from 'fs/promises';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete'

const columns: GridColDef[] = [

  {
    field: 'countryName',
    headerName: 'Страна',
    width: 110,
    editable: false,
    hideable: false,
    filterable: false,
    
  },
  {
    field: 'cases',
    headerName: 'Количество случаев',
    type: 'number',
    width: 160,
    editable: false,
    hideable: false,
    filterable: false,
  },
  {
    field: 'deaths',
    headerName: 'Количество смертей',
    type: 'number',
    width: 160,
    editable: false,
    hideable: false,
    filterable: false,
  },
  {
    field: 'allcases',
    headerName: 'Количество случаев всего',
    type: 'number',
    editable: false,
    hideable: false,
    filterable: false,
    width: 200,
  },
  {
    field: 'alldeaths',
    headerName: 'Количество смертей всего',
    type: 'number',
    editable: false,
    hideable: false,
    filterable: false,
    width: 200,
  },
  {
    field: 'cases1000',
    headerName: 'Количество случаев на 1000 жителей',
    type: 'number',
    editable: false,
    hideable: false,
    filterable: false,
    width: 270,
    
  },
  {
    field: 'deaths1000',
    headerName: 'Количество смертей на 1000 жителей',
    type: 'number',
    editable: false,
    hideable: false,
    filterable: false,
    width: 270,
  },
];

const fields:String[] = [
  "Количество случаев",
  "Количество смертей",
  "Количество случаев всего",
  "Количество смертей всего",
  "Количество случаев на 1000 жителей",
  "Количество смертей на 1000 жителей"
]

export default function DataGridDemo(props:any) {

  const [records, setRecords] = useState([]);
  const [filterCountry, setFilterCountry] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterFieldValueFrom, setFilterFieldValueFrom] = useState(0);
  const [filterFieldValueTo, setFilterFieldValueTo] = useState(0);

  useEffect(() =>{
    createRecords()
  }, [props , filterCountry, filterField, filterFieldValueFrom, filterFieldValueTo])

  const createRecords = () => {
      let newRecords:any = [];

      for (let item of props.data){

          const itemDate = new Date(item.year, item.month-1, item.day)

          if (!newRecords.length || !(item.countriesAndTerritories == newRecords.at(-1).countryName)){
                const newCountry = {
                    id: item.countriesAndTerritories,
                    countryName: item.countriesAndTerritories,
                    cases: 0,
                    deaths: 0,
                    allcases: 0,
                    alldeaths: 0,
                    cases1000: 0,
                    deaths1000: 0
                }
                if ((itemDate >= props.dateFrom) && (itemDate <= props.dateUpTo)){
                  newCountry.cases += item.cases;
                  newCountry.deaths += item.deaths;
                }

                newCountry.allcases += item.cases;
                newCountry.alldeaths += item.deaths;
                newCountry.cases1000 = (newCountry.allcases / item.popData2019) * 1000;
                newCountry.deaths1000 = (newCountry.alldeaths / item.popData2019) * 1000;

                newRecords.push(newCountry);
          }

          else{

              if ((itemDate >= props.dateFrom) && (itemDate <= props.dateUpTo)){
                  newRecords.at(-1).cases += item.cases;
                  newRecords.at(-1).deaths += item.deaths;
              }

              newRecords.at(-1).allcases += item.cases;
              newRecords.at(-1).alldeaths += item.deaths;
              newRecords.at(-1).cases1000 = (newRecords.at(-1).allcases / item.popData2019) * 1000;
              newRecords.at(-1).deaths1000 = (newRecords.at(-1).alldeaths / item.popData2019) * 1000;
          }

      }

      if (filterCountry){
        newRecords = newRecords.filter((item:any) => {
            return item.countryName === filterCountry;
        })
      }
      if (filterField){
        if (filterFieldValueFrom && filterFieldValueTo){
            if(filterField == "Количество случаев"){
              newRecords = newRecords.filter((item:any) => {
                return item.cases >= filterFieldValueFrom && item.cases< filterFieldValueTo;
              })
            }
            else if(filterField == "Количество смертей"){
              newRecords = newRecords.filter((item:any) => {
                return item.deaths >= filterFieldValueFrom && item.deaths< filterFieldValueTo;
              })
            }
            else if(filterField == "Количество случаев всего"){
              newRecords = newRecords.filter((item:any) => {
                return item.allcases >= filterFieldValueFrom && item.allcases< filterFieldValueTo;
              })
            }
            else if(filterField == "Количество смертей всего"){
              newRecords = newRecords.filter((item:any) => {
                return item.alldeaths >= filterFieldValueFrom && item.alldeaths< filterFieldValueTo;
              })
            }
            else if(filterField == "Количество случаев на 1000 жителей"){
              newRecords = newRecords.filter((item:any) => {
                return item.cases1000 >= filterFieldValueFrom && item.cases1000< filterFieldValueTo;
              })
            }
            else if(filterField == "Количество смертей на 1000 жителей"){
              newRecords = newRecords.filter((item:any) => {
                return item.deaths1000 >= filterFieldValueFrom && item.deaths1000< filterFieldValueTo;
              })
            }
        }
      }
      

      setRecords(newRecords);

  }

  const getCountries = () =>{
    const contries = records.map((country:any) => {
        return country.countryName;
    })
    return contries;
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Autocomplete
        disablePortal
        defaultValue = {null}
        id="combo-box-demo"
        options={getCountries()}
        onChange = {(event:any, value:string) => setFilterCountry(value)}
        sx={{ width: 300,display : 'inline-flex' }}
        renderInput={(params) => <TextField {...params} label="Поиск страны..." />}
      />

      <Box sx={{ width:100, display: "inline-flex" }}></Box>

      <Autocomplete
        disablePortal
        defaultValue = {null}
        id="combo-box-demo"
        options={fields}
        onChange = {(event:any, value:any) => setFilterField(value)}
        sx={{ width: 300 ,display : 'inline-flex'}}
        renderInput={(params) => <TextField {...params} label="Фильтровать по полю..." />}
      />

      <Box sx={{ width:30, display: "inline-flex" }}></Box>

      <TextField 
         label="значение от" 
         variant="outlined"
         disabled={!filterField} 
         onChange = {(event) => {setFilterFieldValueFrom(Number(event.target.value))}}
         error = {isNaN(filterFieldValueFrom)}/>

      <Box sx={{ width:30, display: "inline-flex" }}></Box>

      <TextField 
         label="значение до" 
         variant="outlined"
         disabled={!filterField}
         onChange = {(event) => {setFilterFieldValueTo(Number(event.target.value))}}
         error = {isNaN(filterFieldValueTo)} />

      <DataGrid
        rows={records}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        headerHeight={100}
      />
    </Box>
  );
}