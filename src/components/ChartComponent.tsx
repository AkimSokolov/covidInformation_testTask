import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../styles/ChartComponent.css'
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Data } from '../types';
import { Dayjs } from 'dayjs';

interface Props{
    data: Data[],
    dateFrom:  Date | undefined,
    dateUpTo:  Date | undefined,
    countries: string[],
}

export default function ChartComponent (props:Props) {

    const [labels, setLabels] = useState<string[]>([]);
    const [mapDateScope, setMapDateScope] = useState<any[]>([]);
    const [dataSetsCases, setDataSetsCases] = useState<number[]>([])
    const [dataSetsDeaths, setDataSetsDeaths] = useState<number[]>([])
    const [selectedCountry, setSelectedCountry] = useState<string | null>("");

    useEffect(() => {
      setLabels(createLabels())
      setMapDateScope(createMapdateSet())
      setDataSetsCases(createDataSetsCases());
      setDataSetsDeaths(createDataSetsDeaths());
    }, [props, selectedCountry])

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
        maintainAspectRatio: false

    };
    
    function createLabels() {
        const labels = [];
        const dateFrom:Date = new Date (props.dateFrom!);
        const dateUpTo:Date = new Date (props.dateUpTo!);

        while(dateFrom <= dateUpTo){
            const labelElement = (dateFrom.getMonth() + 1) + "/" + (dateFrom.getDate()) + "/" + (dateFrom.getFullYear());

            labels.push(labelElement);
            dateFrom.setDate(dateFrom.getDate() + 1);
        }
        return labels;
    }

    function createMapdateSet() {
        const mapDateSet = [];
        const dateFrom:Date = new Date (props.dateFrom!);
        const dateUpTo:Date = new Date (props.dateUpTo!);
        
        while(dateFrom < dateUpTo){
            const key = (dateFrom.getMonth() + 1) + "/" + (dateFrom.getDate()) + "/" + (dateFrom.getFullYear())
            const mapDateScopeElement = [key , 0];

            mapDateSet.push(mapDateScopeElement);
            dateFrom.setDate(dateFrom.getDate() + 1);
        }
        return mapDateSet;
    }

    function createDataSetsCases() {
        const newDataSetsCases:any = [];
        const MapsDate = new Map(mapDateScope);
        let cases = 0;
        let deaths = 0;

        for (let item of props.data){

            const itemDate = new Date(Number(item.year), Number(item.month)-1, Number(item.day))

            if (selectedCountry && selectedCountry != "Все страны"){
                if (item.countriesAndTerritories == selectedCountry){
                    if(itemDate >= props.dateFrom! && itemDate <= props.dateUpTo!){
                        cases += item.cases;
                        newDataSetsCases.push(cases);
                    }
                }
            }
            else{

                if(itemDate >= props.dateFrom! && itemDate <= props.dateUpTo!){
                    const key = (itemDate.getMonth() + 1) + "/" + (itemDate.getDate()) + "/" + (itemDate.getFullYear());
                    cases += item.cases;
                    MapsDate.set(key , cases);
                }
            } 
        }

        if (!selectedCountry || selectedCountry == "Все страны"){
            return Array.from(MapsDate.values())
        }
        else{
            console.log(newDataSetsCases)
            return newDataSetsCases;
        }
    }

    function createDataSetsDeaths() {
        const newDataSetsDeaths:any = [];
        const MapsDate = new Map(mapDateScope);
        let deaths = 0;

        for (let item of props.data){

            const itemDate = new Date(Number(item.year), Number(item.month)-1, Number(item.day))


            if (selectedCountry && selectedCountry != "Все страны"){
                if (item.countriesAndTerritories == selectedCountry){
                    if(itemDate >= props.dateFrom! && itemDate <= props.dateUpTo!){
                        deaths += item.deaths;
                        newDataSetsDeaths.push(deaths);
                    }
                }
            }
            else{
                if(itemDate >= props.dateFrom! && itemDate <= props.dateUpTo!){
                    const key = (itemDate.getMonth() + 1) + "/" + (itemDate.getDate()) + "/" + (itemDate.getFullYear());
                    deaths += item.deaths;
                    MapsDate.set(key , deaths);
                }
            }
        }

        if (!selectedCountry || selectedCountry == "Все страны"){
            return Array.from(MapsDate.values());
        }
        else{
            return newDataSetsDeaths;
        }
    }
    
    const data = {
        labels,
        datasets: [
            {
                id: 1,
                label: 'Cases',
                data: dataSetsCases,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Deaths',
                data: dataSetsDeaths,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };



    return (
        <div className="ct-chart">
            <Box sx={{  width: '100%' }}>
                <Box
                    sx={{display : 'inline-flex'}}
                >
                    <p>Поиск по стране: </p>
                </Box>
                <Box
                    sx={{display : 'inline-flex', width: 50}}
                ></Box>
                <Autocomplete
                  disablePortal
                  defaultValue = {props.countries[0]}
                  id="combo-box-demo"
                  options={props.countries}
                  onChange = {(event:any, value:string | null) => setSelectedCountry(value)}
                  sx={{ width: 300,display : 'inline-flex' }}
                  renderInput={(params) => <TextField {...params} />}
                />
            </Box>
            <Line 
              options={options} 
              data={data} 
              height={400}/>
        </div>
    );
  
}



