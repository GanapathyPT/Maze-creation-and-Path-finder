import { ROWS, COLS } from "../consts"

export function getInitialGrid() {
	
	const initialGrid = []

	const ROWS_ = new Array(ROWS).fill().map((_, i) => i)
	const COLS_ = new Array(COLS).fill().map((_, i) => i)

	for (let row of ROWS_) {
		initialGrid.push([])
		for (let col of COLS_) {
			initialGrid[row].push({
				row,
				col,
				top: true,
				left: true,
				right: true,
				bottom: true,
				visited: false,

				gScore: Infinity,
				fScore: Infinity,
				cameFrom: null,
				pathVisited: false,
			})
		}
	}
	return initialGrid
}

const getPos = item => [item.row, item.col]

function getAllNeighbours(current, grid) {
	const neighbours = []
	const [row, col ] = getPos(current)

	if (row > 0 && !grid[row - 1][col].visited)
		neighbours.push(grid[row - 1][col])
	if (row < ROWS - 1 && !grid[row + 1][col].visited)
		neighbours.push(grid[row + 1][col])
	if (col > 0 && !grid[row][col - 1].visited)
		neighbours.push(grid[row][col - 1])
	if (col < COLS - 1 && !grid[row][col + 1].visited)
		neighbours.push(grid[row][col + 1])

	return neighbours
}

function getRandomNeighbour(neighbours) {
	const index = Math.floor(Math.random() * neighbours.length)
	return neighbours[index]
}

export function createMaze(gridCopy, callback) {
	const stack = []
	const grid = gridCopy.map(row => [...row])

	stack.push(grid[0][0])
	grid[0][0].visited = true

	while (stack.length > 0) {
		const current = stack.pop()

		const neighbours = getAllNeighbours(current, grid)

		if (neighbours.length > 0) {
			stack.push(current)

			const neighbour = getRandomNeighbour(neighbours)

			if (current.row > neighbour.row) {
				current.top = false
				neighbour.bottom = false
			}
			else if (current.row < neighbour.row) {
				current.bottom = false
				neighbour.top = false
			}
			else if (current.col > neighbour.col) {
				current.left = false
				neighbour.right = false
			}
			else {
				current.right = false
				neighbour.left = false
			}

			neighbour.visited = true
			stack.push(neighbour)

		}
	}

	resetVisited(grid, callback)
	callback(grid)
}

function isWallBetween(current, neighbour) {
	if (current.row > neighbour.row)
		return current.top === false &&
		neighbour.bottom === false

	else if (current.row < neighbour.row)
		return current.bottom === false &&
		neighbour.top === false

	else if (current.col > neighbour.col)
		return current.left === false &&
		neighbour.right === false

	else
		return current.right === false &&
		neighbour.left === false
}

function getNeighbours(current, grid) {
	const neighbours = []
	const row = current.row
	const col = current.col

	if (row > 0 && isWallBetween(current, grid[row - 1][col]))
		neighbours.push(grid[row - 1][col])

	if (row < ROWS - 1 && isWallBetween(current, grid[row + 1][col]))
		neighbours.push(grid[row + 1][col])

	if (col > 0 && isWallBetween(current, grid[row][col - 1]))
		neighbours.push(grid[row][col - 1])

	if (col < COLS - 1 && isWallBetween(current, grid[row][col + 1]))
		neighbours.push(grid[row][col + 1])

	return neighbours
}

function getLowest(openSet) {
	let minIndex = 0
	let min = openSet[0]

	openSet.forEach((item, i) => {
		if (item.fScore < min.fScore) {
			min = item
			minIndex = i
		}
	})

	return [min, minIndex]
}

function heuristic(from_, to) {
	return Math.abs(from_.row - to.row) + Math.abs(to.col - from_.col)
}

function generatePath(start, end, grid, callback) {
	const gridCopy = grid.map(e => [...e])
	let current = end.cameFrom

	while (!!current.cameFrom) {
		current.pathVisited = true	
		gridCopy[current.row][current.col] = current
		callback(gridCopy)
		current = current.cameFrom
	}
}

function resetVisited(grid, callback) {
	const gridCopy = grid.map(e => [...e])
	for (let row of gridCopy) {
		for (let item of row) {
			item.visited = false
		}
	}
	callback(gridCopy)
}

export function getPath(grid, start, end, callback) {
	let current
	let currentIndex

	const openSet = [start]

	const gridCopy = grid.map(e => [...e])

	start.gScore = 0
	start.fScore = heuristic(start, end)

	while (openSet.length > 0) {
		[current, currentIndex] = getLowest(openSet)

		if (current === end) {
			generatePath(start, end, grid, callback)
			return
		}

		openSet.splice(currentIndex, 1)

		const neighbours = getNeighbours(current, grid)

		for (let neighbour of neighbours) {
			const tempGScore = current.gScore + 1

			if (tempGScore < neighbour.gScore) {
				neighbour.cameFrom = current

				neighbour.gScore = tempGScore
				neighbour.fScore = tempGScore + heuristic(neighbour, end)

				if (!openSet.some(
					item => item === neighbour
				)) {
					openSet.push(neighbour)
				}

				neighbour.visited = true
				gridCopy[neighbour.row][neighbour.col] = neighbour
				callback(gridCopy)
			}
		}
		console.group(`${current.row}, ${current.col}`)
			neighbours.map(item => console.log(item.row, item.col))
		console.groupEnd()
	}
	console.log(openSet)
}

