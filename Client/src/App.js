import logo from './logo.svg';
import './App.css';
import React,{useState, useEffect} from 'react';
import WebSocketComponent from "./components/WebSocketComponent";

function App() {

  const [index, setIndex] = useState({});
  const [test,setTest] = useState({});

  useEffect(()=>{
    getIndex();
    getTest();
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
    </div>
  );
}

export default App;
