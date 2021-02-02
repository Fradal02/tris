import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import './index.css';



//
//<button onClick={newGame}>
//  Attiva Lasers
//</button>
//
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
      <label htmlFor="player">Choose a player:</label>
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
      id: props.id,
      board: Array(9).fill(null),
      state: null,
      turn:null
    };
  }

//  newGame(){
//    const recipeUrl = 'http://francesco.local:8000/game/';
//    const postBody = {};
//     const requestMetadata = {
//      method: 'POST',
//      headers: {
//       'Content-Type': 'application/json'
//      },
//        body: JSON.stringify(postBody)
//    };
//  
//  }
//
  componentDidMount() {
    //TODO - rendi la url configurabile
    const recipeUrl = `http://francesco.local:8000/game/${this.state.id}/`;
    //const postBody = {};
    const requestMetadata = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      //body: JSON.stringify(postBody)
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


const AppRouter = () => (
  <BrowserRouter>
    <Route
      path='/game/:game_id/'
      render={props => <Game {...props} />}
    />
    <Route
      path='/'
      render={props => <Home {...props} />}
    />
  </BrowserRouter>
);


class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  newGame(){
    const recipeUrl = `http://francesco.local:8000/game/`;
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
        window.location = `/game/${game.id}`
      });
  }
  
  render() {
    return (
     <p>
       <button onClick={() => this.newGame()}>
        New Game
        </button>
     </p>
    );
  }

}
 

class Game extends React.Component {
  constructor(props) {
    super(props);
    const { game_id } = props.match.params;
    this.state = {
      player: "X", 
      game_id: game_id
    };
    console.log("prova", this.state)
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
          player = {this.state.player}
          id = {this.state.game_id}
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
  <AppRouter />,
  document.getElementById('root')
);
