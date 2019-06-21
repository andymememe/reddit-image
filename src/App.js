import React, { useState } from 'react';
import Articles from './Article';
import './App.css';

function App() {
    const [subreddit, setSubreddit] = useState(
        'funny'
    );
    const [parameter, setParameter] = useState(
        'funny'
    );

    const handleChange = event => setSubreddit(event.target.value);
    const submitChange = _ => setParameter(subreddit);
    
    return (
        <div className="App">
            <h1>Reddit Image</h1>
            <input type="text" value={subreddit} onChange={handleChange}/>
            <button id='go' onClick={submitChange}>Go!</button>
            <Articles subreddit={parameter}/>
        </div>
    );
}

export default App;
