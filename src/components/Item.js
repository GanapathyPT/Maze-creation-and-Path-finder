export default function Item({ col, onClick, start, end }) {
	const handleClick = () => onClick(col)

	return (
		<div 
		onClick={handleClick}
		className={`grid__item ${
			start ? "start" :
			end ? "end" :
			col.path ? "path" : 
			col.visited ? "visited" : ""
		}`} 
		style={{
			borderLeft: col.left ? "1px solid black" : "none",
			borderRight: col.right ? "1px solid black" : "none",
			borderTop: col.top ? "1px solid black" : "none",
			borderBottom: col.bottom ? "1px solid black" : "none",
			animationDelay: col.delay ? (col.delay + "ms") : 0,
		}}>
		</div>
	)
}