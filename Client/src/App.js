import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React,{useState, useEffect} from 'react';
import WebSocketComponent from "./components/WebSocketComponent";
import LinePlot from "./components/LinePlot";
import ArcComponent from "./components/ArcComponent";
function App() {

  const [index, setIndex] = useState({});
  const [test,setTest] = useState({});
  const lineData = [5,10,43,65,2134,9];
  const [pieData, setPieData] = useState([]);

  const city = "Memphis";
  const county = "Shelby";
  const state = {name:"Tennessee",abbreviation:"TN"};
  const [cityData, setCityData] = useState([]);
  const [countyData, setCountyData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [triStateData, setTriStateData] = useState([]);
  const [crimeData, setCrimeData] = useState([]);

    useEffect(()=>{
    // getIndex();
    // getTest();
        getTriStateData();

    return () =>{

    }
  },[cityData,countyData,stateData])

     const getStateData= async ()=> {
            const response = await fetch(`/api/v1/crime/search?state=${state.abbreviation}`);
            const data = await response.json();
            setStateData(data);

            //Filter city data
            const filterByCity = data.filter(x => x.location.city === city);
            setCityData(filterByCity);

            //Filter by county
            const filterByCounty = data.filter(x => x.location.county === county);
            setCountyData(filterByCounty);
     };

    const getTriStateData = async () =>{
        const response = await fetch(`/api/v1/crime/tri-state`)
        const data = await response.json();
        setTriStateData(data);

        /// Set data for tri-state
        var pieData = createTriStatePieData(data);
        setTriStateData(pieData);

        /// Set data for categories
        pieData = createCrimeData(data);
        setCrimeData(pieData);
    }


    const createTriStatePieData = data => {
        var tempArray = [];
        let state = undefined;

        //Maps data into an array that keeps track of the total number of crimes per state
        data.map(elem => {
            state = tempArray.find(x => x.name === elem.location.state);

            if(state === undefined)
                tempArray.push({name:elem.location.state, total: 0});
            else
                state.total += 1;
        });
        return tempArray;
    };


    const createCrimeData = data =>{
        var tempArray = [];
        let category = undefined;

        //Maps data into an array that keeps track of the total number of crime types
        data.map(elem => {
            category = tempArray.find(x => x.name === elem.category.primary);

            // //Sets remaining to other if there are more than 5 categories
            // if(category === undefined && tempArray.length >= 6){
            //     category = tempArray.find(x => x.name === "Other");
            //     if(category === undefined)
            //         tempArray.push({name:"Other", total: 0});
            //     else
            //         category.total += 1;
            // }

            if(category === undefined)
                tempArray.push({name:elem.category.primary, total: 0});
            else
                category.total += 1;
        });
        return tempArray;
    }


  const getIndex = async ()=>{
    const response = await fetch('/api/v1/index');
    const data = await response.json();
    setIndex(data);
  }

  const getTest = async ()=>{
    const response = await fetch('/api/v1/test');
    const data = await response.json();
    setTest(data);
  }

  return (
    <div className="container">
        <div>
           <div className='d-flex'>
               <div>
                   <div>{city}</div>
                   <div>{cityData.length}</div>
               </div>

               <div>
                   <div>{county}</div>
                   <div>{countyData.length}</div>
               </div>

               <div>
                   <div>{state.name}</div>
                   <div>{stateData.length}</div>
               </div>
           </div>
        </div>

      <WebSocketComponent />
        <div>
            { triStateData.length !== 0 ? <ArcComponent data={triStateData} /> :<></> }
        </div>
        <div>
            { crimeData.length !== 0 ? <ArcComponent data={crimeData} /> : <></>}
        </div>
    </div>
  );
}

export default App;
