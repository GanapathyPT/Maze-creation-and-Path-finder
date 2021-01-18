import { useState, useEffect } from "react"
import { createMaze, getPath, getInitialGrid } from "../algorithm"
import Row from "./Row"

export default function App() {
	const [grid, setGrid] = useState(getInitialGrid)
	const [start, setStart] = useState(null)
	const [end, setEnd] = useState(null)
	const [path, setPath] = useState(false)

	useEffect(() => {
		createMaze(grid, setGrid)
		// eslint-disable-next-line
	}, [])

	const handleClick = (item) => {
		if (path) return
		if (!start)
			setStart(item)
		else if (!!start && item === start)
			setStart(null)
		else if (!end && item !== start)
			setEnd(item)
		else if (!!end && item === end)
			setEnd(null)
	}

	const handleStart = () => {
		if (!!start && !!end && !path) {
			getPath(grid, start, end, setGrid)
			setPath(true)
		}
		else if (path) {
			window.location.reload()
		}
	}

	return (
		<div className="center">
			<div>
				<h1 align="center">Maze Generation and Path Finding</h1>
				<div className="reference">
					<div className="ref">
						<div className="grid__item start mr" />
						Start
					</div>
					<div className="ref">
						<div className="grid__item end mr" />
						End
					</div>
					<button className="start__btn" onClick={handleStart}>
						{path ? "Reset" : "Start"}
					</button>
					<div className="ref">
						<div className="grid__item visited mr" />
						Searched
					</div>
					<div className="ref">
						<div className="grid__item path mr" />
						Path
					</div>
				</div>
				<div>
					{
						grid.map((row, i) => 
							<Row 
							key={i} 
							row={row} 
							start={start}
							end={end}
							onClick={handleClick} 
							/>
						)
					}
				</div>
			</div>
		</div>
	)
}