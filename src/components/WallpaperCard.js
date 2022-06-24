import React from 'react'

export default function WallpaperCard({baseURL, wallpaper, nsfwFilter}) {
    return (
        <a className="wallpaper" href={wallpaper.url} target="_blank" rel="noopener noreferrer">
            <img className={(wallpaper.over_18 && nsfwFilter) ? "thumbnail nsfw" : "thumbnail"} src={wallpaper.preview.images[0].resolutions[wallpaper.preview.images[0].resolutions.length - 2].url.replaceAll("amp;","")} alt={wallpaper.title}/>
            <div className="description">
                <div className="title">{wallpaper.title}</div>
                <div>
                    From <a href={baseURL + wallpaper.subreddit} target="_blank" rel="noopener noreferrer">r/{wallpaper.subreddit}</a>
                    &nbsp;&nbsp;·&nbsp;&nbsp;
                    <a href={"https://reddit.com" + wallpaper.permalink} target="_blank" rel="noopener noreferrer">view post</a>
                </div>
            </div>
            <div className="resolution">
                {wallpaper.preview.images[0].source.width} x {wallpaper.preview.images[0].source.height}
            </div>
            {(wallpaper.preview.images[0].source.width / wallpaper.preview.images[0].source.height > 2.20) ?
                <div className="aspect">Ultrawide</div>
                : 
                ""
            }
        </a>
    );
}