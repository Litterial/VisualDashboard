import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React,{useState, useEffect} from 'react';
import WebSocketComponent from "./components/WebSocketComponent";
import ArcComponent from "./components/ArcComponent";
import useWebSocket from "./hooks/useWebSocket";
import ChartGraphComponent from "./components/ChartGraphComponent";
function App() {

  // const [index, setIndex] = useState({});
  // const [test,setTest] = useState({});
  // const lineData = [5,10,43,65,2134,9];
  // const [pieData, setPieData] = useState([]);

  const { isConnected, lastMessage, error, sendMessage } = useWebSocket('ws');
  const city = "Memphis";
  const county = "Shelby";

  const [state,setState] = useState({name:"Tennessee",abbreviation:"TN"});
  const topCities = ["Memphis","Nashville","Knoxville","Chattanooga","Clarksville"]
  const [cityData, setCityData] = useState([]);
  const [countyData, setCountyData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [triStateData, setTriStateData] = useState([]);
  const [crimeData, setCrimeData] = useState([]);
  const [topCityData, setTopCityData] = useState([]);

  const [location,setLocation] = useState({
      city:"Memphis",
      county:"Shelby",
      state: {
          name: "Tennessee",
          abbreviation: "TN"
      }
  });

  const listedStates = [{name:"Tennessee",abbreviation:"TN"},{name:"Mississippi",abbreviation:"MS"},{name:"Arkansas",abbreviation:"AR"}]
  const [cities,setCities] = useState([]);
    useEffect(()=>{
        loadInitialDashboardData();
        getTriStateData();

    return () =>{

    }
  },[lastMessage])


     const loadInitialDashboardData = async () =>{
         let response = await fetch(`/api/v1/crime/search?state=${state.abbreviation}`);
         let data = await response.json();
         setStateData(data);

         //Filter city data
         const filterByCity = data.filter(x => x.location.city === location.city);
         setCityData(filterByCity);

         //Filter by county
         const filterByCounty = data.filter(x => x.location.county === location.county);
         setCountyData(filterByCounty);

         const filterTopCities = data.filter(elem => topCities.includes(elem.location.city));
         let pieData = createTopCityData(filterTopCities);
         setTopCityData(pieData);



          response = await fetch(`api/v1/location/filter?state=${state.abbreviation}`);
          data = await response.json();
          setCities(data);

     }

     const getStateData = async ()=> {
            const response = await fetch(`/api/v1/crime/search?state=${state.abbreviation}`);
            const data = await response.json();
            setStateData(data);

             const filterTopCities = data.filter(elem => topCities.includes(elem.location.city));
             var pieData = createTopCityData(filterTopCities);
             setTopCityData(pieData);
     };



    const getLocationData = async () =>{
        const response = await fetch(`/api/v1/crime/search?state=${state.abbreviation}`);
        const data = await response.json();
        setStateData(data);

        //Filter city data
        const filterByCity = data.filter(x => x.location.city === location.city);
        setCityData(filterByCity);

        //Filter by county
        const filterByCounty = data.filter(x => x.location.county === location.county);
        setCountyData(filterByCounty);
    }

    const getTriStateData = async () =>{
        const response = await fetch(`/api/v1/crime/tri-state`)
        const data = await response.json();
        setTriStateData(data);

        /// Set data for tri-state
        var pieData = createTriStatePieData(data);
        setTriStateData(pieData);

        /// Set data for categories
        var barChartData = createCrimeData(data);
        setCrimeData(barChartData);


    }


    const createTopCityData = data => {
        var tempArray = [];
        let city = undefined;

        //Maps data into an array that keeps track of the total number of crimes per state
        data.map(elem => {
            city = tempArray.find(x => x.name === elem.location.city);

            if(city === undefined)
                tempArray.push({name:elem.location.city, total: 0});
            else
                city.total += 1;
        });
        return tempArray;
    };


    const createCrimeData = data =>{
        var tempArray = [];
        let category = undefined;

        //Maps data into an array that keeps track of the total number of crime types
        data.map(elem => {
            category = tempArray.find(x => x.name === elem.category.primary);

            if(category === undefined)
                tempArray.push({name:elem.category.primary, total: 0});
            else
                category.total += 1;
        });
        return tempArray;
    }

    const createTriStatePieData = data => {
        var tempArray = [];
        let state = undefined;

        //Maps data into an array that keeps track of the total number of crimes per state
        data.map(elem => {
            state = tempArray.find(x => x.name === elem.location.state.abbreviation);

            if(state === undefined)
                tempArray.push({name:elem.location.state.abbreviation, total: 0});
            else
                state.total += 1;
        });
        return tempArray;
    };


  const uploadCSV = async e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const response = await fetch(`/api/v1/crime/upload-crimes-csv`,
        {
            method: 'POST',
            contentType: 'multipart/form-data',
            body: formData,
        });

      console.log(response.status);

      if(response.status === 200)
        sendMessage("File uploaded successfully.");

  }

  const changeState = async e => {
      e.preventDefault();
      const response = await fetch(`api/v1/location/filter?state=${e.target.value}`);
      const data = await response.json();
      setCities(data);
  }
    const changeCity = async e => {
        e.preventDefault();
        const selectedCity = cities.find(x => x.city === e.target.value);
        setLocation(selectedCity);

        const response = await fetch(`/api/v1/crime/search?state=${selectedCity.state.abbreviation}`);
        const data = await response.json();
        setStateData(data);

        //Filter city data
        const filterByCity = data.filter(x => x.location.city === selectedCity.city);
        setCityData(filterByCity);

        //Filter by county
        const filterByCounty = data.filter(x => x.location.county === selectedCity.county);
        setCountyData(filterByCounty);


    }
  return (
    <div className="container mb-2">
        <div className="d-flex justify-content-lg-between">

            <select className="form-select form-select-lg" onChange={changeCity}>
                <option>Select a city</option>
                {cities.map(elem => {
                    return (elem.city === location.city)? <option selected key={elem.city} value={elem.city}>{elem.city}</option> : <option key={elem.city} value={elem.city}>{elem.city}</option>
                })}

            </select>
            <select className="form-select form-select-lg" onChange={changeState}>
                {listedStates.map(elem => {
                    return <option key={elem.name} value={elem.abbreviation}>{elem.name}</option>
                })}
            </select>
        </div>
        <div className="mt-3">
            <div className="h2 mb-3">Number of crimes</div>
           <div className='box-shadow d-flex justify-content-between mt-3 p-3 text-center'>
               <div>
                   <div className="h4 roh-blue">{location.city}</div>
                   <div className="h4 roh-green">{cityData.length}</div>
               </div>

               <div>
                   <div className="h4 roh-blue">{location.county} County</div>
                   <div className="h4 roh-green">{countyData.length}</div>
               </div>

               <div>
                   <div className="h4 roh-blue">{location.state.name}</div>
                   <div className="h4 roh-green">{stateData.length}</div>
               </div>
           </div>
        </div>

        <div className="pb-2">
            { triStateData.length !== 0 ? <div className="mt-3">
                <div className="h2">Crimes in Tri-state area</div>
                <ArcComponent data={triStateData} /> </div>
                :<></> }
            { topCityData.length !== 0 ? <div className="mt-3">
                <div className="h2">Crimes in Major Cities (TN)</div>
                <ArcComponent data={topCityData} />
            </div>: <></>}

            { crimeData.length !== 0 ? <div className="mt-3">
                <div className="h2">Crime categories</div>
                <ChartGraphComponent data={crimeData} />
            </div>: <></>}
        </div>

        <div className="h2">Upload Crime Data</div>
        <form onSubmit={uploadCSV} id='cvsForm'>
            <label htmlFor="crimeFile" className="form-label">Select and upload a .CSV file to update metrics</label>
            <input className="form-control form-control-lg" type="file" name="crimeFile" id="crimeFile"/>
            <div className="mt-2">
                <button className="btn btn-success btn-lg" type="submit">Upload .CSV</button>

            </div>
        </form>
    </div>
  );
}

export default App;
