import Item from "./Item"

export default function Row({ row, onClick, start, end }) {
	return (
		<div className="d__flex">
		{
			row.map((col, j) => 
				<Item 
				col={col} 
				start={!!start 
					&& start.col === col.col 
					&& start.row === col.row
				}
				end={!!end 
					&& end.row === col.row
					&& end.col === col.col}
				key={j} 
				onClick={onClick} 
				/>
			)
		}
		</div>
	)
}