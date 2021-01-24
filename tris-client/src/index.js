import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


//class Square extends React.Component {
//  render() {
//    return (
//      <button 
//        className="square"
//        onClick={() => this.props.onClick()}
//      >
//        {this.props.value}
//      </button>
//    );
//  }
//}

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }


function PlayerSelect(props){
    return (
      <>
      <label for="player">Choose a player:</label>
      <select name="player" id="player"
        onChange={props.change} value={props.player}>
        <option value="X">X</option>
        <option value="O">O</option>
      </select>
      </>
    );
}


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      board: Array(9).fill(null),
      state: null,
      turn:null
    };
  }

  componentDidMount() {
    //TODO - rendi la url configurabile
    const recipeUrl = 'http://francesco.local:8000/game/';
    const postBody = {};
    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody)
    };

    fetch(recipeUrl, requestMetadata)
      .then(res => res.json())
      .then(game => {
        console.log(game);
        this.setState( game );
      });
  }


  handleClick(i) {
    const recipeUrl = `http://francesco.local:8000/game/${this.state.id}/`;
    const postBody = {
      player:this.props.player, 
      position: i
    };
    const requestMetadata = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody)
    };

    fetch(recipeUrl, requestMetadata)
      .then(res => res.json())
      .then(game => {
        console.log(game);
        this.setState( game );
      });
  }
      
  renderSquare(i) {
    return (
      <Square
      value={this.state.board[i]}
      onClick={() => this.handleClick(i)}
    />
  );
}

  render() {
    console.log("state su render", this.state)
    return (
      <>
      <p>game id:{this.state.id}</p>
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
      </>
    );
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: "X"
    };
  }

  changePlayer(event){
    console.log("target", event.target)
    console.log("value", event.target.value)
    this.setState({player:event.target.value})
  }

  render() {
    return (
      <div className="game">
        <div className="player">
          <PlayerSelect 
           player={this.state.player}
           change={(event) => this.changePlayer(event)}
          />
        </div>
        
        <div className="game-board">
          <Board 
          player={this.state.player}
          />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
