import {useState,useEffect,useRef,useCallback} from 'react';


const useWebSocket = path => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage,setLastMessage] = useState(null);
    const [error,setError] = useState(null);
    const ws = useRef(null);


    //useCallback will return a new value for the sendMessage function that is identical to the previous one across renders
    //Functions, objects, and arrays are passed by reference
    const sendMessage = useCallback(message => {
        if(ws.current && ws.current.readyState === WebSocket.OPEN)
            ws.current.send(message);
        else
            console.warn('WebSocket not connected. Unable to send message',message);
    },[]);


    //TODO: Consider using state to track the cleanup of the connection to prevent multiple connections
    //TODO: Investigate proxy issues
    useEffect(() => {
        // Construct the WebSocket URL relative to the current host
        // window.location.protocol will be 'http:'
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${protocol}://localhost:5000/${path}`;

        ws.current = new WebSocket(wsUrl);
        ws.current.onopen = () => {
            setIsConnected(true);
            setError(null);
            console.log('WebSocket Connected:', ws.current);
        };

        ws.current.onmessage = event => {
            setLastMessage(event.data);
            console.log('Received message:', event.data);
        };

        ws.current.onerror = event => {
            console.error('WebSocket error:', event);
            setError(event);
            setIsConnected(false);
        };

        ws.current.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket disconnected.');
        };

        //Clean-up function
        return () => {
            if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
                ws.current.close();
            }
        };
    },[path]);

    return { isConnected, lastMessage, error, sendMessage };
};


export default useWebSocket;