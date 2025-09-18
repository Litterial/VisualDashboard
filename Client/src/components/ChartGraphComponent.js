import * as d3 from 'd3';
import {useEffect,useState,useRef} from "react";

export default function ChartGraphComponent(props){

    const {data} = props;

    const svgRef = useRef();
    // const legendRef = useRef();


    //TODO: Make graph responsive
    const width = 1024;
    const height = 800;

    const margin = {top: 30, right: 20, left: 20, bottom: 30};

    const colorOrdinal = d3.scaleOrdinal(data.map(d => d.name),d3.schemePastel2);

    const reducer = (accumulator, currentValue) => accumulator + currentValue.total;

    const total = data.reduce(reducer,0);

    const roundToNearestTenth = number => Math.round(number * 10) / 10;

    useEffect(() => {
        //generate bar chart graph
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        svg.selectAll("*").remove();

        // Use a more descriptive name, like 'chartArea'
        const chartArea = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([0, width - margin.left - margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.total)])
            .range([height - margin.top - margin.bottom, 0]);

        // Creates axis using the new variable name
        chartArea.append("g")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        chartArea.append("g")
            .call(d3.axisLeft(yScale));

        // 5. Create bars
        chartArea.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .classed("bar", true)
            .attr("x", d => xScale(d.name))
            .attr("y", d => yScale(d.total))
            .attr("width", xScale.bandwidth())
            .attr("height", d => (height - margin.top - margin.bottom) - yScale(d.total))
            .attr("fill", d => colorOrdinal(d.name))
            .on("mouseover", (event,d) => {
                d3.select(event.currentTarget)
                    .attr("opacity", 0.6);

                // Append a new text element to the group
                chartArea.append("text")
                    .classed("bar-label", true)
                    .attr("x", xScale(d.name) + xScale.bandwidth() / 2)
                    .attr("y", yScale(d.total) - 5)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "12px")
                    .attr("fill", "black")
                    .text(d.total);
            })
            .on("mouseout", (event,d) => {
                d3.select(event.currentTarget).attr("opacity", 1.0);

                // Select and remove the text element created on mouseover
                chartArea.selectAll(".bar-label").remove();
            });

        return () => {};
    },[])
    return(<div className="align-items-start border border-1 d-flex justify-content-center m-0 pie-chart-container">
            <svg ref={svgRef} className="pie-svg-chart" viewBox="0 0 1024 800"></svg>
        {/*    <div ref={legendRef} id="legend-container" className="border border-3 mark mt-auto me-2">*/}
        {/*        <h6>Legend</h6>*/}
        {/*</div>*/}

    </div>)
}