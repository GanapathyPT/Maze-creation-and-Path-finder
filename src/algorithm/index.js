import { ROWS, COLS } from "../consts"

export const getInitialGrid = () => (
	Array(ROWS)
		.fill(0)
		.map((row, i) => (
			Array(COLS)
				.fill(0)
				.map((col, j) => ({
					row: i,
					col: j,
					// borders
					top: true,
					left: true,
					bottom: true,
					right: true,
					// check if already visited
					visited: false,
					// scores for a star algo
					gScore: Infinity,
					fScore: Infinity,
					// the last node that thisnode is calculated
					camFrom: null,
					// whether it is a path node
					path: false
				}))
		))
)

// helper function to get the position as an array
const getPos = item => [item.row, item.col]

// get all the neighbour for maze creation
// visited neighbour is not valid here
function getAllNeighbours(current, grid) {
	const neighbours = []
	const [row, col ] = getPos(current)

	if (row > 0 && !grid[row - 1][col].visited)// top
		neighbours.push(grid[row - 1][col])

	if (row < ROWS - 1 && !grid[row + 1][col].visited)// bottom
		neighbours.push(grid[row + 1][col])
	
	if (col > 0 && !grid[row][col - 1].visited)// left
		neighbours.push(grid[row][col - 1])
	
	if (col < COLS - 1 && !grid[row][col + 1].visited)// right
		neighbours.push(grid[row][col + 1])

	return neighbours
}

// get a random neighbour from the list of neighbours
function getRandomNeighbour(neighbours) {
	const index = Math.floor(Math.random() * neighbours.length)
	return neighbours[index]
}

// main funciton to create a maze using dfs
export function createMaze(gridCopy, callback) {
	// stack DS to track the current node
	const stack = []
	const grid = gridCopy.map(row => [...row])

	// starting with first node and mark it as visited
	stack.push(grid[0][0])
	grid[0][0].visited = true

	while (stack.length > 0) {
		// taking the last item visited in the stack and get all their nighbours
		const current = stack.pop()
		const neighbours = getAllNeighbours(current, grid)

		// proceed only if there is atleast one neighbour
		if (neighbours.length > 0) {
			// as the current node has a nighbour it is added to the stack
			stack.push(current)
			// get a radom neighbour from the neighbours list
			const neighbour = getRandomNeighbour(neighbours)

			// removing the wall between the current and the considered neighbour

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

			// mark the neighbour as visited
			neighbour.visited = true
			stack.push(neighbour)
		}
	}

	// resetting all the visited back to normal node
	resetVisited(gridCopy, callback)
	callback(grid)
}

// checking whether there is a wall between current and neighbour
function isWallBetween(current, neighbour) {
	if (current.row > neighbour.row)
		return !current.top && !neighbour.bottom

	else if (current.row < neighbour.row)
		return !current.bottom && !neighbour.top

	else if (current.col > neighbour.col)
		return !current.left && !neighbour.right

	else
		return !current.right && !neighbour.left
}

// get all the neighbours for a star algo
// if there is a wall between the current and neighbour it is not valid
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

// get the node that has lowest fScore
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

// Manhattan distance for heuristic
function heuristic(from_, to) {
	return Math.abs(from_.row - to.row) + Math.abs(to.col - from_.col)
}

// generate the path from the result of a star algo
function generatePath(start, end, grid, callback) {
	const gridCopy = grid.map(e => [...e])
	let current = end.cameFrom

	while (!!current.cameFrom) {
		current.path = true	
		gridCopy[current.row][current.col] = current
		callback(gridCopy)
		current = current.cameFrom
	}
}

// restting all the node as normal
function resetVisited(grid, callback) {
	const gridCopy = grid.map(e => [...e])
	for (let row of gridCopy) {
		for (let item of row) {
			item.visited = false
		}
	}
	callback(gridCopy)
}

// main func for a star
export function getPath(grid, start, end, callback) {
	let i = 1
	let current
	let currentIndex

	// openSet to store the current node considered
	const openSet = [start]
	const gridCopy = grid.map(e => [...e])

	// making the gScore of start as 0 and fScore to the heuristic
	start.gScore = 0
	start.fScore = heuristic(start, end)

	while (openSet.length > 0) {
		// get the lowest node from the openSet
		[current, currentIndex] = getLowest(openSet)

		if (current === end) {
			// as the current node is the end node finish execution
			generatePath(start, end, grid, callback)
			return
		}
		// remove the current node from openSet
		openSet.splice(currentIndex, 1)

		// get all the neighbours for the currnet node
		const neighbours = getNeighbours(current, grid)
		for (let neighbour of neighbours) {
			// get the gScore for all the neighbour for the current node
			const tempGScore = current.gScore + 1

			if (tempGScore < neighbour.gScore) {
				// if the calculated gScore is lesser than the old gScore
					// update the gScore, fScore
				neighbour.cameFrom = current

				neighbour.gScore = tempGScore
				neighbour.fScore = tempGScore + heuristic(neighbour, end)

				// if the neighbour is not in openSet adding it
				if (!openSet.some(
					item => item === neighbour
				)) {
					openSet.push(neighbour)
				}

				neighbour.visited = true
				// for animation delay 
				neighbour.delay = i++ * 50
				// updating the grid for the neighbour with new scores
				gridCopy[neighbour.row][neighbour.col] = neighbour
				callback(gridCopy)
			}
		}
	}
}

