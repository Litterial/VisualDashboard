import * as d3 from 'd3';
import {useEffect, useRef} from 'react'

export default function ArcComponent(props){

    const {data} = props;

    //TODO: Make graph responsive
    const width = 640;
    const height = 400;


    const svgRef = useRef();
    const legendRef = useRef();
    const customColors = ["red","orange","yellow", "green", "blue", "indigo", "violet"];

    //d3.range returns an array of integers from 0 to length - 1

    //d3.scaleOrdinal creates a measurement scale that maps data in a purposeful order or rank (i.e. grades for classes on a report card)
    //For primitive type data objects, it's best to use the index of each element so that it's unique
    //For non-primitive, use the array of objects
    const colorOrdinal = d3.scaleOrdinal(data.map(elem => elem.name),d3.schemePastel2);

    // console.log(colorOrdinal.range());

    const reducer = (accumulator, currentValue) => accumulator + currentValue.total;

    const total = data.reduce(reducer,0);

    const roundToNearestTenth = number => Math.round(number * 10) / 10;

    useEffect(() =>{


        //Generate pie chart
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height',height)
            //.classed('border',true);

        svg.selectAll("*").remove();

        // Moves pie chart to center of div
        const g = svg.append("g")
             .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // .value tells the layout which property of the object represents the size of the slice
        const pie = d3.pie().value(d => d.total)
        const pieData = pie(data);

        //Creates arc generator that draws the path of each pie slice
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(width, height) / 2 - 20)





        const slices = g.selectAll('arc')
            .data(pieData)
            .enter()
            .append('g')
            .classed('arc', true)


           slices.append('path')
            .attr('fill', ((elem,ndx) => {
                return colorOrdinal(elem.data.name)
            }))
            .attr('d', arc)

        slices.append("text")
            .attr("transform", data => `translate(${arc.centroid(data)})`) // Position label in the center of the arc
            .attr("dy", "0.25em")
            .attr("text-anchor", "middle")
            .text((elem, ndx) =>  {
                const value = (elem.data.total / total) * 100;
                const percent = roundToNearestTenth(value);
                return `${elem.data.total} (${percent}%)`;
            });


        const legendContainer = d3.select(legendRef.current)

        legendContainer.selectAll('*').remove();

        var label = legendContainer.append('div')
            .classed('mb-2', true)
            .text( elem => 'Legend')

        const legend = label.selectAll('.legend-item')
            .data(colorOrdinal.domain())
            .enter()
            .append('div')
            .classed("legend-item", true)


        legend.append('div')
            .classed('legend-color-box', true)
            .style("background-color", elem => colorOrdinal(elem))

        legend.append('span')
            .text(elem => elem)


        return () =>{
        }
    },[data,width,height])

    return(
        <>
            <div className="align-items-start border border-1 d-flex justify-content-center m-0 pie-chart-container ">
                <svg className="pie-svg-chart" ref={svgRef} viewBox="0 0 1024 500"></svg>
                <div ref={legendRef} id="legend-container" className="border border-3 mark mt-auto me-2">
                    <h6>Legend</h6>
                </div>

            </div>

    </>)
}
