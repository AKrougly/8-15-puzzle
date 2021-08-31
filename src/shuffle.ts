export function invCount(arr: number[]): number {
  //heck it dosen't matter in n=9 still
  //can be done using merge sort O(nlgn)
  //current O(n^2)
  let inv = 0;
  for(let i = 0; i < arr.length - 1; ++i) {
    for(let j = i + 1; j < arr.length; ++j) {
      if(arr[i] > arr[j] && arr[i] !== 0 && arr[j] !== 0)
        inv++;
    }
  }
  return inv;
}

export function initGrid(gridSize: number) {
  let grid = [...Array(gridSize)].map((r, i) => {
    return Array(gridSize).fill(null).map((c, j) => {
      return i===(gridSize-1)&&j===(gridSize-1)?0:i*gridSize+j+1;
    });
  });

  return grid;
}

export function shuffle(gridSize: number): number[] {
  //redo with fisher yates algo
  let arr: number[] = Array.from({length: gridSize * gridSize}, (_, i) => i);
  let copy: number[] = [];
  let n: number = arr.length
  let i: number;

  while(n) {
    //pick a random element 
    i = Math.floor(Math.random() * arr.length);

    if (i in arr) {
      copy.push(arr[i]);
      delete arr[i];
      n--;
    }
  }

  return copy;
}

export function shuffleGrid(gridSize: number): number[][] {
  let arr: number[] = [];
  let ret: number[][] = [...Array(gridSize)].map(x => []);
  
  do {
    arr = shuffle(gridSize);
  } while (invCount(arr) % 2 !== 0);

  for(let i = 0; i < arr.length; ++i) {
    ret[Math.floor(i / gridSize)].push(arr[i]);
  }

  return ret;
}

export function isSolved(grid: number[][]) {
  let gridSize: number = grid.length;
  let correctGrid = initGrid(gridSize);
  for (let i = 0; i < gridSize - 1; i++)
    for (let j = 0; j < gridSize; j++)
      if(grid[i][j] !== correctGrid[i][j])
        return false;
  return true;
}
