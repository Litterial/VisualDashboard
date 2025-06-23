import React, {useEffect} from 'react';
import useWebSocket from '../hooks/useWebSocket';

export default function WebSocketComponent() {
    // Pass the path that your backend expects after the proxy
    const { isConnected, lastMessage, error, sendMessage } = useWebSocket('ws');
    // ... rest of your component logic

    useEffect(() => {
        return () => {}
    },[])

    return(
        <div>
            <button onClick={() => sendMessage("This is test message from the client.")}>Send Message</button>
        </div>
    )
}