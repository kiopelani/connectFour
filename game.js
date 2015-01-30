// THE GAME MODEL

function Game(){
  this.board = new Board();
  this.view = new View();
  this.players = [new Player("black", 1), new Player("red", -1)];
  this.winner = null;
  this.activePlayer = this.players[0];
}

Game.prototype.addToCol = function(col){
  this.board.addPiece(col, this.activePlayer.num);
}

Game.prototype.piecesRemaining = function(){
  if(this.activePlayer.pieces > 0){
    return true;
  }
  else{
    return false;
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
}

Player.prototype.removePiece = function(){
    if(this.pieces > 0){
     this.pieces = this.pieces - 1;
    }
}

// VIEW
function View(){
  this.currentPlayer = $('#current-player');
  this.board = $('#board');
  this.messages = $('#messages');
}

View.prototype.displayMessage = function(message){
  this.messages.html(message);
}

View.prototype.refreshBoard = function(boardPieces){
  this.board.html(boardPieces.toString());
}

View.prototype.playerStats = function(info){
  this.currentPlayer.html(info);
}

// CONTROLLER

function Controller(){
  this.game = new Game();
}

Controller.prototype.start = function(){
  while(this.game.winner === null){
    this.play();
  }
  this.game.view.displayMessage("THE WINNER IS " + this.game.winner);
}

Controller.prototype.play = function(){
  this.game.view.refreshBoard(this.game.board.allPieces);
  this.game.view.playerStats("Player: " +this.game.activePlayer.color + " Pieces: " + this.game.activePlayer.pieces);
  if(this.game.piecesRemaining()){
    var col = prompt("Enter your column number");
    this.game.addToCol(parseInt(col));
    this.game.activePlayer.removePiece();
    if(this.game.board.connectFour()===false){
      this.game.changeActivePlayer();
    }
    else {
      this.game.winner = this.game.activePlayer.color;
    }
  }
  else {
    this.game.winner = "DRAW. No one wins."
  }
}

// DRIVER CODE
$( document ).ready(function() {
  var controller = new Controller();
  controller.start();
});