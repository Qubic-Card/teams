let data = {
    labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
    datasets: [
      {
        values: [10, 12, 3, 9, 8, 15, 9]
      }
    ]
  };
  let container = "#chart"
  let axisopt =  {
    xAxisMode: 'tick',
    yAxisMode: 'tick',
    yIsSeries: true 
}
  let lineopt = {
    regionFill: 1,
    heatline: 1,
    spline:1,
    dotSize: 8
  }