import * as d3 from 'd3';
import {useEffect, useRef} from 'react'

export default function ArcComponent(props){

    const {data} = props;
    const width = 640;
    const height = 400;


    const svgRef = useRef();
    const customColors = ["red","orange","yellow", "green", "blue", "indigo", "violet"];

    //d3.range returns an array of integers from 0 to length - 1
    const dataDomain = d3.range(data.length);

    //d3.scaleOrdinal creates a measurement scale that maps data in a purposeful order or rank (i.e. grades for classes on a report card)
    //For primitive type data objects, it's best to use the index of each element so that it's unique
    const colorOrdinal = d3.scaleOrdinal(dataDomain,customColors);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    const total = data.reduce(reducer,0);

    const roundToNearestTenth = number => Math.round(number * 10) / 10;

    useEffect(() =>{
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height',height)
            .classed('border',true);

        svg.selectAll("*").remove();

        const g = svg.append("g")
             .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(width, height) / 2 - 20)


        const pie = d3.pie()
        const pieData = pie(data);


        const slices = g.selectAll('arc')
            .data(pieData)
            .enter()
            .append('g')
            .classed('arc', true)


           slices.append('path')
            .attr('fill', ((elem,ndx) => colorOrdinal(ndx)))
            .attr('d', arc)

        slices.append("text")
            .attr("transform", data => `translate(${arc.centroid(data)})`) // Position label in the center of the arc
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text((elem, ndx) =>  {
                const value = (elem.value / total) * 100;
                const percent = roundToNearestTenth(value);
                return `${percent}%`;
            });






        console.log(colorOrdinal.domain());


        return () =>{
        }
    },[data,width,height])

    return(
        <>
            <svg ref={svgRef}></svg>

    </>)
}

// import * as d3 from 'd3';
// import { useEffect, useRef } from 'react';
//
// export default function ArcComponent(props) {
//     const { data } = props; // Assuming data is an array of numbers, e.g., [10, 20, 30, 40]
//     const width = 640;
//     const height = 400;
//
//     const svgRef = useRef();
//
//     // Define your custom colors
//     const customColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "purple"]; // Added one more for good measure
//
//     // --- FIX 1: Correctly define the d3.scaleOrdinal with both domain and range ---
//     // The domain should be the indices of your data points, as you're using 'ndx' for color
//     const colorScale = d3.scaleOrdinal()
//         .domain(d3.range(data.length)) // Create domain as [0, 1, 2, ..., data.length - 1]
//         .range(customColors);
//
//     useEffect(() => {
//         const svg = d3.select(svgRef.current)
//             .attr('width', width)
//             .attr('height', height)
//             .classed('border', true);
//
//         // Clear previous chart on re-render (good practice)
//         svg.sele
