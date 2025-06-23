import * as d3 from "d3";

export default function LinePlot(props) {

    const { data } = props;
    const width = 640;
    const height = 400;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 20;
    const marginLeft = 20;

    const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
    // Function line(x,y)  If x or y are not specified, the respective defaults will be used.
    const line = d3.line((elem, ndx) => x(ndx), (elem) => y(elem));
    return (
        <svg width={width} height={height}>
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
            <g fill="white" stroke="currentColor" strokeWidth="1.5">
                {data.map((elem, ndx) => (<circle key={ndx} cx={x(ndx)} cy={y(elem)} r="2.5" />))}
            </g>
        </svg>
    );
}