//V 0.0 without manhatan function
//implment visited using hashing
//queue
const top: number = 0;
const parent: (i: number) => number = i => ((i + 1) >>> 1) - 1;
const left: (i: number) => number = i => (i << 1) + 1;
const right: (i: number) => number = i => (i + 1) << 1;
let gridSize: number;
let arrSize: number;

class PriorityQueue {
  _heap: Board[];
  _comparator: (a: Board, b: Board) => boolean;

  constructor(comparator = (a: Board, b: Board) => a.hamming >  b.hamming) {
    this._heap = [];
    this._comparator = comparator;
  }
  size(): number {
    return this._heap.length;
  }
  isEmpty(): boolean {
    return this.size() === 0;
  }
  peek(): Board {
    return this._heap[top];
  }
  push(...values: Board[]) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this._swap(top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value: Board) {
    const replacedValue = this.peek();
    this._heap[top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i: number, j: number) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i: number, j: number) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node: number = this.size() - 1;
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node: number = top;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild: number = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

class Board {
  arr: number[];
  empty_pos: number;
  priority: number;
  parent: Board | null;
  
  constructor(arr: number[]) {
    this.arr = arr;
    this.empty_pos = this.calc_empty();
    this.priority = this.hamming();
    this.parent = null;
  }

  hamming(): number {
    let h = 0;
    for(let i = 0; i < this.arr.length - 1; i++) {
      if(this.arr[i] !== i + 1)
        h++;
    }
    return h;
  }

  calc_empty(): number {
    let empty_pos: number = 0;
    for (let i = 0; i < this.arr.length; i++) {
      if (this.arr[i] === 0) {
        empty_pos = i;
        i = this.arr.length;
      }
    }
    return empty_pos;
  }
}

let correctBoard: Board;
let leftmostColumn: number[];
let rightmostColumn: number[];

//isBoardSame(board1,board2)
//isVisited(board,visittedpuzzles)
//isSolved(board)returns true if board is of orignal config
//getNextBoards(board) returns an array of config board possible with one move
//bfs to solve the board 
function getGridSize(b1: Board): number {
  return Math.ceil(Math.sqrt(b1.arr.length));
}

function isBoardSame(b1: Board, b2: Board) {
  for (let i = 0; i < b1.arr.length; i++)
    if (b1.arr[i] !== b2.arr[i])
      return false;
  return true;
}

function isSolved(b1: Board) {
  if(isBoardSame(b1, correctBoard)) return true;
  return false;
}

function getNextBoards(b1: Board) {
  let gridSize: number = getGridSize(b1);
  let ret=[];
  //swap with up
  if (b1.empty_pos > gridSize - 1) {
    let arr = b1.arr.slice();
    arr[b1.empty_pos] = arr[b1.empty_pos - gridSize];
    arr[b1.empty_pos - gridSize] = 0;
    let temp: Board = new Board(arr);
    temp.parent = b1;
    ret.push(temp);
  }
  //swap with down 
  if (b1.empty_pos < gridSize * (gridSize - 1)) {
    let arr = b1.arr.slice();
    arr[b1.empty_pos] = arr[b1.empty_pos + gridSize];
    arr[b1.empty_pos + gridSize] = 0;
    let temp = new Board(arr);
    temp.parent = b1;
    ret.push(temp);
  }
  //swap with left
  if (!leftmostColumn.includes(b1.empty_pos)) {
    let arr=b1.arr.slice();
    arr[b1.empty_pos] = arr[b1.empty_pos - 1];
    arr[b1.empty_pos - 1] = 0;
    let temp = new Board(arr);
    temp.parent = b1;
    ret.push(temp);        
  }
  //swap with right
  if (!rightmostColumn.includes(b1.empty_pos)) {
    let arr=b1.arr.slice();
    arr[b1.empty_pos] = arr[b1.empty_pos + 1];
    arr[b1.empty_pos + 1] = 0;
    let temp = new Board(arr);
    temp.parent = b1;
    ret.push(temp);        
  }
  return ret;
}

function cmp(b1: Board, b2: Board) {
  return b1.hamming() < b2.hamming();
}

function solver(start_board: Board): Board {
  //push into queue 
  //pop minimum hamming distance boad from queue
  //check if answer
  //while queue not empty if children not visited push in queue  
  //change visited to a hash table
  let visited: Board[] = [];
  let q: PriorityQueue = new PriorityQueue(cmp);
  q.push(start_board);
  while (!q.isEmpty()) {
    let curr: Board = q.peek();
    visited.push(curr);
    if (isSolved(curr)) {
      console.log('isSolved');
      return curr;
    }
    let children = getNextBoards(curr);
    q.pop();
    for (let child of children){
      let to_push = true;
      for (let board of visited)
        if(isBoardSame(board, child)) to_push = false;
      if (to_push)
        q.push(child);  
    }
  }
  return new Board([]);
}

//converts a 1d array into 2d array
function arr1d_2d(arr: number[]): number[][] {
	let gridSize: number = Math.ceil(Math.sqrt(arr.length));
	let grid: number[][] = [...Array(gridSize)].map(x => []);
	for (let i = 0; i < arr.length; i++) {
		grid[Math.floor(i / gridSize)].push(arr[i]);
	}
	return grid;
}

//converts a 2d array into 1d array
function arr2d_1d(arr2d: number[][]): number[] {
	let arr1d: number[] = [];
	for (let i = 0; i < arr2d.length; i++) {
		arr1d = arr1d.concat(arr2d[i]);
	}
	return arr1d;
}

export function listMoves(grid: number[][]): number[][][] {
  gridSize = grid.length;
  arrSize = gridSize * gridSize;
  correctBoard = new Board(Array.from({length: arrSize}, (_, i) => i === (arrSize - 1) ? 0 : i + 1));
  leftmostColumn = Array.from({length: gridSize}, (_, i) => i * gridSize);
  rightmostColumn = Array.from({length: gridSize}, (_, i) => (i + 1) * gridSize - 1);
  let arr: number[] = arr2d_1d(grid);
  let ret: number[][][] = [];
  let puzzle = new Board(arr); 
  let sol: Board = solver(puzzle);

  while (sol.parent !== null) {
    ret.push(arr1d_2d(sol.arr));
    sol = sol.parent;
  }
  ret.push(arr1d_2d(sol.arr));
  ret.reverse();

  return ret;
}

export function isSolvable(puzzle: number[][]): boolean {
  let parity: number = 0;
  let gridWidth: number = puzzle.length;
  let row: number = 0; // the current row we are on
  let blankRow: number = 0; // the row with the blank tile
  let arr: number[] = arr2d_1d(puzzle);

  for (let i = 0; i < arr.length; i++) {
    if (i % gridWidth === 0) { // advance to next row
      row++;
    }
    if (arr[i] === 0) { // the blank tile
      blankRow = gridWidth - row + 1; // save the row on which encountered
      continue;
    }
    for (let j = i + 1; j < arr.length; j++)
    {
      if (arr[i] > arr[j] && arr[j] !== 0)
      {
        parity++;
      }
    }
  }

  console.log('blankRow:'+blankRow);
  console.log('parity:'+parity);
  if (gridWidth % 2 === 0) { // even grid
    if (blankRow % 2 === 0) { // blank on odd row; counting from bottom
      return parity % 2 !== 0;
    } else { // blank on even row; counting from bottom
      return parity % 2 === 0;
    }
  } else { // odd grid
    return parity % 2 === 0;
  }
}
