import axios from 'axios';
import _ from 'lodash';
import React from 'react';
import './App.css';

import WallpaperCard from './components/WallpaperCard';

function App() {

    const wallpaperSubs = 'wallpapers+wallpaper+widescreenwallpaper';
    const baseURL = 'https://www.reddit.com/r/';
    const sorts = ['hot','new','top','controversial','rising'];

    const [currentSub, setCurrentSub] = React.useState(wallpaperSubs);
    const [currentSort, setCurrentSort] = React.useState('hot');
    const [nsfwFilter, setNsfwFilter] = React.useState(true);

    const [data, setData] = React.useState([]);
    const [isErrorResponse, setIsErrorResponse] = React.useState(false);

    React.useEffect(()=> {
        axios.get(baseURL+currentSub+"/" + currentSort + ".json?limit=100")
            .then((response) => {
                setData(response.data.data.children);
                if (!isErrorResponse) {
                    setIsErrorResponse(false);
                }
            })
            .catch((err) => {
                setIsErrorResponse(true);
            });
    },[])

    function subChange(sub) {
        if (sub === "" || sub === undefined) {
            sub = wallpaperSubs;
        }
        setData([]);
        setIsErrorResponse(false);
        axios.get(baseURL+sub+"/" + currentSort + ".json?limit=100")
            .then((response) => {
                setCurrentSub(sub);
                setData(response.data.data.children);
                if (!isErrorResponse) {
                    setIsErrorResponse(false);
                }
            })
            .catch((err) => {
                setIsErrorResponse(true);
            });
    }

    const _subChange = _.debounce((sub)=>subChange(sub),600);

    return (
    <section className="container">
        <div className="searchbar">
        <input type="text" name="subreddit" placeholder="start typing a subreddit..." onChange={event=>_subChange(event.target.value.trim())}/>
        <button className="btnSettings">
            <i className="fas fa-cog" onClick={()=> {
                document.getElementById("options").style.visibility = 
                    (document.getElementById("options").style.visibility === "visible") 
                        ? "hidden" : "visible";
            }}></i>
            <div className="options" id="options">
                <div>
                    <i className={(nsfwFilter) ? "fas fa-check-circle green" : "fas fa-times-circle red"}></i>
                    <input type="checkbox" onClick={() => {
                            setNsfwFilter(document.getElementById("nsfwFilter").checked);
                        }} id="nsfwFilter" checked={nsfwFilter}/>
                    <label for="nsfwFilter">NSFW Filter</label>
                </div>
            </div>
        </button>
        </div>
        <div className="wallpapers">
        {
            (data.length > 0) ?
            data.map((item) => (
            (item.data.preview) ? (( item.data.preview.enabled) ?
                <div key={item.data.id} className={(item.data.preview.images[0].source.width / item.data.preview.images[0].source.height > 2.20) ? "card grid-span-2" : "card"}>
                <WallpaperCard baseURL={baseURL} wallpaper={item.data} nsfwFilter={nsfwFilter}/>
                </div>
            : "") : ""
            )) : (!isErrorResponse) ? <div class="lds-dual-ring"></div> : <div className="error"><i className="fas fa-exclamation-triangle"></i><div>Network Error or Sub does not exist :/</div></div>
        }
        </div>      
    </section>
    );
}

export default App;
