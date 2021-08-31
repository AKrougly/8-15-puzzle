import React from "react";

export interface ICellIndex {
  i: number;
  j: number;
}

interface ITileProps {
  value: number;
  key: number;
  cellIndex: ICellIndex;
  handleClick: (cell_index: ICellIndex) => void;
  correctPosition: boolean;
}

interface ITileState {
  cellIndex: ICellIndex,
  handleClick: (cellIndex: ICellIndex) => void,
  correctPosition: boolean
}

export default class Tile extends React.Component<ITileProps, ITileState> {
  constructor(props: ITileProps) {
    super(props);
    this.state = {
      cellIndex: this.props.cellIndex,
      handleClick: this.props.handleClick,
      correctPosition: this.props.correctPosition
    };
  }
  
  // uncomment to disable highlighting when tile is in correct position
  // correctPosition = false;
  
  render () {
    if (this.props.value !== 0) {
      return (
        <span
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            this.state.handleClick(this.state.cellIndex);
          }}
          className={`tile ${this.props.correctPosition && ('tile-correct')}`}
        >
          {this.props.value}
        </span>
      );
    } else {
      return <span className="tile_empty">.</span>;
    };
  }
}

