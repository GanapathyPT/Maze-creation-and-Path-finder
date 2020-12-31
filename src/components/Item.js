export default function Item({ col, onClick, start, end }) {

	const handleClick = () => {
		onClick(col)
	}

	return (
		<div 
		onClick={handleClick}
		className={`grid__item ${
			start ? "start" : ""
		} ${
			end ? "end" : ""
		} ${
			col.visited ? "visited" : ""
		} ${
			col.pathVisited ? "pathVisited" : ""
		}`} 
		style={{
			borderLeft: col.left ? "1px solid black" : "none",
			borderRight: col.right ? "1px solid black" : "none",
			borderTop: col.top ? "1px solid black" : "none",
			borderBottom: col.bottom ? "1px solid black" : "none",
		}}>
		</div>
	)
}