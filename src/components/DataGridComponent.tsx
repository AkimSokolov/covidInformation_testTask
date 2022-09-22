import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete'
import { Button } from '@mui/material';
import Stack from '@mui/system/Stack';
import { Data, Records } from '../types';
import { Dayjs } from 'dayjs';

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

interface Props{
    data: Data[],
    dateFrom: Dayjs | Date | undefined,
    dateUpTo: Dayjs | Date | undefined,
    getCountries: (records: Data[]) => void,
}


export default function DataGridComponent(props:Props) {

  const [records, setRecords] = useState<Records[]>([]);
  const [contries, setContries] = useState<string[]>([]);
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [filterField, setFilterField] = useState<string>("");
  const [filterFieldValueFrom, setFilterFieldValueFrom] = useState<number>(0);
  const [filterFieldValueTo, setFilterFieldValueTo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(7);

  useEffect(() =>{
    createRecords()
  }, [props , filterCountry, filterField, filterFieldValueFrom, filterFieldValueTo])

  const createRecords = () => {
      let newRecords:Records[] = [];

      for (let item of props.data){

          const itemDate = new Date(Number(item.year), Number(item.month)-1, Number(item.day))

          if (!newRecords.length || !(item.countriesAndTerritories == newRecords.at(-1)!.countryName!)){
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
                if ((itemDate >= props.dateFrom!) && (itemDate <= props.dateUpTo!)){ 
                  newCountry.cases += item.cases;
                  newCountry.deaths += item.deaths;
                }

                newCountry.allcases += item.cases;
                newCountry.alldeaths += item.deaths;
                newCountry.cases1000 = (newCountry.allcases / Number(item.popData2019)) * 1000;
                newCountry.deaths1000 = (newCountry.alldeaths / Number(item.popData2019)) * 1000;

                newRecords.push(newCountry);
          }

          else{

              if ((itemDate >= props.dateFrom!) && (itemDate <= props.dateUpTo!)){
                  newRecords.at(-1)!.cases += item.cases;
                  newRecords.at(-1)!.deaths += item.deaths;
              }

              newRecords.at(-1)!.allcases += item.cases;
              newRecords.at(-1)!.alldeaths += item.deaths;
              newRecords.at(-1)!.cases1000 = (newRecords.at(-1)!.allcases / Number(item.popData2019)) * 1000;
              newRecords.at(-1)!.deaths1000 = (newRecords.at(-1)!.alldeaths / Number(item.popData2019)) * 1000;
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
      
      getCountries(newRecords)
      setRecords(newRecords);

  }

  function getCountries  (newRecords:Records[])  {
    const contries = newRecords.map((country:any) => {
        return country.countryName;
    })
    setContries(contries);
  }

  function changeFilterCountry(event: any, value: any){
    setFilterCountry(value);

  }

  function resetFilters(){
    setFilterCountry('');
    setFilterField('');
    setFilterFieldValueFrom(0);
    setFilterFieldValueTo(0);
  }

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <Autocomplete
        disablePortal
        value={filterCountry}
        options={["", ...contries]}
        onChange={changeFilterCountry}
        sx={{ width: 300,display : 'inline-flex' }}
        renderInput={(params) => <TextField {...params} label="Поиск страны..." />}
      />

      <Box sx={{ width:100, display: "inline-flex" }}></Box>

      <Autocomplete
        disablePortal
        value={filterField}
        options={["", ...fields]}
        onChange={(event:any, value:any) => setFilterField(value)}
        sx={{ width: 300 ,display : 'inline-flex'}}
        renderInput={(params) => <TextField {...params} label="Фильтровать по полю..." />}
      />

      <Box sx={{ width:30, display: "inline-flex" }}></Box>

      <Box sx={{ width:500, display: "inline-flex" }}>
          <TextField 
            variant="outlined"
            value={filterFieldValueFrom ? filterFieldValueFrom : (filterFieldValueFrom === 0 ? filterFieldValueFrom : null)}
            disabled={!filterField} 
            onChange={(event) => {setFilterFieldValueFrom(Number(event.target.value))}}
            error={isNaN(filterFieldValueFrom)}/>

          <Box sx={{ width:30, display: "inline-flex" }}></Box>

          <TextField  
            variant="outlined"
            value={filterFieldValueTo ? filterFieldValueTo : (filterFieldValueTo === 0 ? filterFieldValueTo : null)}
            disabled={!filterField}
            onChange={(event) => {setFilterFieldValueTo(Number(event.target.value))}}
            error={isNaN(filterFieldValueTo)} />
      </Box>


      <Stack spacing={3} direction="row"  sx={{}}>
          <Box sx={{ width:850}}></Box>
          <Autocomplete
            disablePortal
            value={pageSize.toString()}
            options={[1,2,3,4,5,6,7].map((item) => {return(item.toString())})}
            onChange = {(event:any, value:any) => setPageSize(value)}
            sx={{ width: 300}}
            renderInput={(params) => <TextField {...params} label="Размер страницы" />}
          />

          <Button 
              onClick={resetFilters}>
            Сбросить фильтры</Button>

      </Stack>

      <DataGrid
          rows={records}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[pageSize]}
          disableSelectionOnClick
          headerHeight={100}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                Ничего не найдено
              </Stack>
            ),
          }}
      />
    </Box>
  );
}