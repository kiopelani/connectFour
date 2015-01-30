// THE GAME MODEL

function Game(){
  this.board = new Board();
  this.players = [new Player("black", 1), new Player("red", -1)];
  this.winner = null;
  this.activePlayer = this.players[0];
  this.addToCol = function(col){
    this.board.addPiece(col, this.activePlayer.num);
  }
  this.piecesRemaining = function(){
    if(this.activePlayer.pieces > 0){
      return true;
    }
    else{
      return false;
    }
  }
}

Game.prototype.changeActivePlayer = function(){
  if(this.activePlayer === this.players[0]){
    this.activePlayer = this.players[1];
  }
  else{
    this.activePlayer = this.players[0];
  }
}

// BOARD MODEL

function Board(){
  this.allPieces = [[0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0]];
  this.lastAdded = null;
}

Board.prototype.connectFour = function(){
  if(this.lastAdded !== null){
    if(this.checkRow(this.lastAdded[0])){
      return true;
    }
    if(this.checkCol(this.lastAdded[1])){
      return true;
    }
    return false;
  }
  else{
    return false;
  }
}

Board.prototype.checkRow = function(row){
    var playerNum = this.allPieces[row][0];
    for(i = 1; i < 4; i++){
      if(this.allPieces[row][i] !== playerNum){
        return false;
      }
    }
    return true;
}

Board.prototype.checkCol = function(col){
  if(this.allPieces[0][col] !== 0){
    var playerNum = this.allPieces[0][col];
    for(i = 1; i < 4; i++){
      if(this.allPieces[i][col] !== playerNum){
        return false;
      }
    }
    return true;
  }
  else{
    return false;
  }
}

Board.prototype.addPiece = function(col, playerNum){
  var filled = false;
    i = 3;
    while(filled === false && i >= 0){
      if(this.allPieces[i][col] === 0){
        this.allPieces[i][col] = playerNum;
        filled = true;
        this.lastAdded = [i,col];
      }
      else{i = i - 1;}
    }
}


// PLAYER MODEL

function Player(color, num){
  this.color = color;
  this.num = num;
  this.pieces = 8;
  this.removePiece = function(){
    if(this.pieces > 0){
     this.pieces = this.pieces - 1;
    }
  }
}


// CONTROLLER

function Controller(){
  this.game = new Game();
  this.start = function(){
    while(this.game.winner === null){
      this.play();
    }
    console.log("THE WINNER IS " + this.game.winner);
  };
}

Controller.prototype.play = function(){
  console.log(this.game.board);
  console.log("Player: " +this.game.activePlayer.color + " Pieces: " + this.game.activePlayer.pieces);
    if(this.game.piecesRemaining()){
      var col = prompt("Enter your column number");
      this.game.addToCol(parseInt(col));
      this.game.activePlayer.removePiece();
      if(this.game.board.connectFour()===false){
        this.game.changeActivePlayer();
      }
      else {
        this.game.winner = this.game.activePlayer.color;
        console.log("Winner!");
      }
    }
    else{
      this.game.winner = "DRAW. No one wins."
      console.log("Draw");
    }
}

// DRIVER CODE

$( document ).ready(function() {
  var controller = new Controller();
  controller.start();
});