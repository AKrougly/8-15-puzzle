import React from "react";
import { initGrid, shuffleGrid, isSolved } from "./shuffle";
import { listMoves, isSolvable } from "./solver";
import { ICellIndex } from "./Tile";
import Tile from "./Tile";

import "./puzzle.scss";

enum Directions { Up, Down, Left, Right }

interface IPuzzleProps {

}

interface IPuzzleState {
  time: number;
  grid: number[][];
  emptyCell: ICellIndex;
  canBeSolved: boolean;
  solving: boolean;
}

export default class Puzzle extends React.Component<IPuzzleProps, IPuzzleState> {
  playTimer: number = 0;
  autoPlayTimer: number = 0;
  gridSize: number = 4;

  constructor(props: IPuzzleProps) {
    super(props);
    this.state = {
      time: 0,
      grid: initGrid(this.gridSize),
      emptyCell: {i: this.gridSize - 1, j: this.gridSize - 1} as ICellIndex,
      canBeSolved: true,
      solving: false,
    };
  }

  componentDidMount() {}
  componentWillUnmount() {
    //this.stopClock();
  }

  getMinutesStr = (): string => {
    return (Array(2).join('0')+(Math.floor(this.state.time / 60))).slice(-2);
  }

  getSecundesStr = (): string => {
    return (Array(2).join('0')+(this.state.time % 60)).slice(-2);
  }

  formatTime = (): string => {
    return `${this.getMinutesStr()} : ${this.getSecundesStr()}`;
  }

  increment = () => {
    this.setState((state) => ({ time: state.time + 1 }));
  };
  startClock = () => {
    this.playTimer = window.setInterval(this.increment, 1000);
  };
  stopClock = () => {
    window.clearInterval(this.playTimer);
  };

  reset = () => {
    let grid: number[][] = initGrid(this.gridSize);
    this.stopClock();
    this.setState({ grid: grid, emptyCell: {i: this.gridSize - 1, j: this.gridSize - 1} as ICellIndex, canBeSolved: true });
  };

  calcEmptyCell = (grid: number[][]): ICellIndex => {
    for (let i = 0; i < this.gridSize; i++)
      for (let j = 0; j < this.gridSize; j++)
        if (grid[i][j] === 0) {
          return { i: i, j: j} as ICellIndex;
        }
    return { i: 0, j: 0} as ICellIndex;
  }

  shufflePuzzle = () => {
    let grid: number[][] = shuffleGrid(this.gridSize);

    this.setState({
      time: 0,
      grid: grid,
      emptyCell: this.calcEmptyCell(grid),
      canBeSolved: isSolvable(grid),
    });
    this.startClock();
  };
  
  isCorrectPosition = (cellIndex: ICellIndex, value: number) => {
    return value === cellIndex.i * this.gridSize + cellIndex.j + 1;
  }

  started_solving = () => {
    this.stopClock();
    
    this.setState({ solving: true });
  };

  stop_solve = () => {
    clearInterval(this.autoPlayTimer);
    this.setState({ solving: false });
  };

  solve = () => {
    let sol: number[][][] = listMoves(this.state.grid);
    let i = 0;
    if (sol.length > 1 && !this.state.solving) {
      this.started_solving();
      this.autoPlayTimer = window.setInterval(() => {
        if (i < sol.length) {
          this.setState({ time: sol.length - i - 1, grid: sol[i], emptyCell: this.calcEmptyCell(sol[i]) });
          i++;
        } else this.stop_solve();
      }, 250);
      this.reset();
      //for(let i=0;i<sol.length;i++)
      //    this.setState(sol[i]);
    }
  };

  handleChange = (direction: Directions | undefined) => {
    let down = direction === Directions.Down && this.state.emptyCell.i !== 0;
    let up = direction === Directions.Up && this.state.emptyCell.i !== this.gridSize - 1;
    let right = direction === Directions.Right && this.state.emptyCell.j !== 0;
    let left = direction === Directions.Left && this.state.emptyCell.j !== this.gridSize - 1;

    if (down || up || right || left) {
      let newEmptyCell: ICellIndex = {i: 0, j: 0} as ICellIndex;
      if (down) {
        newEmptyCell.i = this.state.emptyCell.i - 1;
        newEmptyCell.j = this.state.emptyCell.j;
      }
      if (up) {
        newEmptyCell.i = this.state.emptyCell.i + 1;
        newEmptyCell.j = this.state.emptyCell.j;
      }
      if (right) {
        newEmptyCell.i = this.state.emptyCell.i;
        newEmptyCell.j = this.state.emptyCell.j - 1;
      }
      if (left) {
        newEmptyCell.i = this.state.emptyCell.i;
        newEmptyCell.j = this.state.emptyCell.j + 1;
      }

      //swaping
      let chngdGrid: number[][] = [...this.state.grid];
      let temp: number = chngdGrid[this.state.emptyCell.i][this.state.emptyCell.j];
      chngdGrid[this.state.emptyCell.i][this.state.emptyCell.j] = chngdGrid[newEmptyCell.i][newEmptyCell.j];
      chngdGrid[newEmptyCell.i][newEmptyCell.j] = temp;
      this.setState({ grid: chngdGrid, emptyCell: newEmptyCell, });
    }
  };

  handleClick = (cellIndex: ICellIndex): void => {
    if (this.state.emptyCell.i === cellIndex.i + 1 && this.state.emptyCell.j === cellIndex.j) {
      this.handleChange(Directions.Down);
    }
    if (this.state.emptyCell.i === cellIndex.i - 1 && this.state.emptyCell.j === cellIndex.j) {
      this.handleChange(Directions.Up);
    }
    if (this.state.emptyCell.j === cellIndex.j - 1 && this.state.emptyCell.i === cellIndex.i) {
      this.handleChange(Directions.Left);
    }
    if (this.state.emptyCell.j === cellIndex.j + 1 && this.state.emptyCell.i === cellIndex.i) {
      this.handleChange(Directions.Right);
    }
  };

  handleKeyDown = (event: KeyboardEvent) => {
    let direction: Directions | undefined = undefined;
    if (event.code === 'ArrowDown') direction = Directions.Down; else
    if (event.code === 'ArrowUp') direction = Directions.Up; else
    if (event.code === 'ArrowRight') direction = Directions.Right; else
    if (event.code === 'ArrowLeft') direction = Directions.Left;
    this.handleChange(direction);
  };

  render () {
    let correct: boolean = isSolved(this.state.grid);
    document.addEventListener("keydown", this.handleKeyDown);
    
    return (
      <div className="card">
        <div className="board">
          {//box section
          this.state.grid.map((list, i) => {
            return (
              <div key={i}>
                {list.map((item, j) => {
                  return (
                    <Tile
                      value={this.state.grid[i][j]}
                      key={j}
                      cellIndex={{ i: i, j: j } as ICellIndex}
                      handleClick={this.handleClick}
                      correctPosition={this.isCorrectPosition({ i: i, j: j } as ICellIndex, this.state.grid[i][j])}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="clock">
          <h3>{this.formatTime()}</h3>
        </div>
        <div className="buttons">
            <button
              onClick={correct ? this.shufflePuzzle : this.reset}
              disabled={this.state.solving}
            >
              {correct ? "START" : "RESET"}
            </button>
            <button
              className="solve"
              onClick={!this.state.solving && this.state.canBeSolved ? this.solve : this.stop_solve}
            >
              {this.state.canBeSolved ? (!this.state.solving ? "SOLVE" : "STOP") : "Can't be solved"}
            </button>
          </div>
      </div>
    );
  }
}
