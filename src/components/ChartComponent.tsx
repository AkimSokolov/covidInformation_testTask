import React from 'react';
import ReactDOM from 'react-dom';
import ChartistGraph from 'react-chartist';

export default function ChartComponent () {

    const data = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
      ]
    };

    const options = {
      high: 10,
      low: -10,
      axisX: {
        labelInterpolationFnc: function(value:any, index:any) {
          return index % 2 === 0 ? value : null;
        }
      }
    };

    const type = 'Bar'

    let aspectRatio = "ct-chart";


    return (
        <ChartistGraph data={data} options={options} type={type} className={aspectRatio} />
    )
  
}
