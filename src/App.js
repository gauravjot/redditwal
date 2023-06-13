import axios from "axios";
import _ from "lodash";
import React from "react";
import "./App.css";

import WallpaperCard from "./components/WallpaperCard";

function App() {
	const wallpaperSubs = "wallpapers+wallpaper+widescreenwallpaper+WQHD_Wallpaper";
	const baseURL = "https://www.reddit.com/r/";

	const [currentSub, setCurrentSub] = React.useState(wallpaperSubs);
	const currentSort = "hot";
	const [nsfwFilter, setNsfwFilter] = React.useState(false);

	const [data, setData] = React.useState([]);
	const [isErrorResponse, setIsErrorResponse] = React.useState(false);
	let settingsRef = React.useRef(null);

	React.useEffect(() => {
		setIsErrorResponse(false);
		setData([]);
		axios
			.get(baseURL + currentSub + "/" + currentSort + ".json?limit=1000")
			.then((response) => {
				setData(response.data.data.children);
			})
			.catch((err) => {
				setIsErrorResponse(true);
			});
	}, [currentSub]);

	function subChange(sub) {
		if (sub.length < 1) {
			setCurrentSub(wallpaperSubs);
			return;
		}
		if (sub.length < 3) {
			return;
		}
		setCurrentSub(sub);
	}

	const _subChange = _.debounce((sub) => subChange(sub), 600);

	function aspectClassSwitch(width, height) {
		let a_ratio = width / height;
		switch (true) {
			case a_ratio > 3.5:
				return "card grid-span-3";
			case a_ratio > 2.2:
				return "card grid-span-2";
			case a_ratio > 0.8:
				return "card";
			case a_ratio > 0.4:
				return "card grid-row-span-2";
			default:
				return "d-none";
		}
	}

	const toggleEventHandler = React.useCallback((e) => {
		/* useCallback so function doesnt change in re-renders
       otherwise our add/remove eventListeners will go haywire */
		/* whitelisted with if-else loop:
		   1. The menu box
		   2. The button which is toggle
		   3. Close-icon in Multiselect
		   add more for exceptions */
		if (
			!document.getElementById("settings-menu")?.contains(e.target) &&
			!settingsRef.current.contains(e.target)
		) {
			toggleSettings();
		}
	}, []);

	/* Filter Toggle */
	const toggleSettings = () => {
		if (settingsRef.current) {
			let attribValue = settingsRef.current.getAttribute("aria-hidden");
			settingsRef.current.setAttribute(
				"aria-hidden",
				attribValue === "true" ? "false" : "true"
			);
			if (attribValue === "true" ? false : true) {
				window.removeEventListener("click", toggleEventHandler);
			} else {
				// Detect clicks outside of filter box
				window.addEventListener("click", toggleEventHandler);
			}
		}
	};

	let prevScrollpos = window.pageYOffset;
	window.onscroll = function () {
		let currentScrollPos = window.pageYOffset;
		if (currentScrollPos < 200 || prevScrollpos > currentScrollPos) {
			document.getElementById("nav-bar").style.top = "0";
		} else {
			settingsRef.current.setAttribute("aria-hidden", "true");
			window.removeEventListener("click", toggleEventHandler);
			document.getElementById("nav-bar").style.top = "-6rem";
		}
		prevScrollpos = currentScrollPos;
	};

	return (
		<section className="container">
			<div className="searchbar" id="nav-bar">
				<div className="container flex">
					<input
						type="text"
						name="subreddit"
						placeholder="start typing a subreddit..."
						onChange={(event) => _subChange(event.target.value.trim())}
					/>
					<div className="dropdown" id="settings-menu">
						<button
							className="btnSettings"
							onClick={() => {
								toggleSettings();
							}}
						>
							<span className="ic ic-settings invert-1"></span>
						</button>
						<div
							className="menu"
							id="options"
							aria-hidden="true"
							ref={settingsRef}
						>
							<button
								className="menu-item"
								onClick={() => {
									setNsfwFilter(!nsfwFilter);
								}}
							>
								<span
									className={
										(nsfwFilter ? "ic-checked" : "ic-unchecked") +
										" ic-md invert-1"
									}
								></span>
								<label htmlFor="nsfwFilter">Enable NSFW</label>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="wallpapers">
				{data.length > 0 ? (
					data.map((item) =>
						item.data.preview ? (
							item.data.preview.enabled &&
							item.data.preview.images[0].resolutions[
								item.data.preview.images[0].resolutions.length - 1
							] ? (
								<div
									key={item.data.id}
									className={aspectClassSwitch(
										item.data.preview.images[0].source.width,
										item.data.preview.images[0].source.height
									)}
								>
									<WallpaperCard
										baseURL={baseURL}
										wallpaper={item.data}
										nsfwFilter={nsfwFilter}
									/>
								</div>
							) : (
								""
							)
						) : (
							""
						)
					)
				) : !isErrorResponse ? (
					<div className="lds-dual-ring"></div>
				) : (
					<div className="error">
						<i className="fas fa-exclamation-triangle"></i>
						<div>Network Error or Sub does not exist :/</div>
					</div>
				)}
			</div>
		</section>
	);
}

export default App;
