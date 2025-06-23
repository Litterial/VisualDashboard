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
  const pieData = [2,4,6,8,10,12,1];

  useEffect(()=>{
    getIndex();
    getTest();

    return () =>{

    }
  },[])

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
    <div className="">
      <div>{index.message}</div>
      <div>{test.message}</div>
      <div>Hello World</div>
      <WebSocketComponent />
      <div>
          <LinePlot data={lineData} />
      </div>
        <div>
            <ArcComponent data={pieData} />
        </div>
    </div>
  );
}

export default App;
