// THE GAME MODEL

function Game(){
  this.board = new Board();
  this.view = new View(this);
  this.players = [new Player("Pink", 1), new Player("LightGreen", -1)];
  this.winner = null;
  this.activePlayer = this.players[0];
}

Game.prototype.start = function(){
  this.play();
}

Game.prototype.play = function(){
  this.view.playerStats(this.activePlayer.color +"'s Turn - " + this.activePlayer.pieces + " Remaining");
  if(this.winner !== null){
    $('#active-piece').draggable('disable');
    this.view.showWinner(this.winner);
  }
  else if(this.piecesRemaining() === false){
    this.winner = "NO ONE. It's a draw.";
    $('#active-piece').draggable('disable');
    this.view.showWinner(this.winner);
  }
  else{
    this.view.prepareDragDrop(this.activePlayer);
  }
}

Game.prototype.colFull = function(col){
  if(this.board.allPieces[0][col] === 0){
    return false;
  }
  else {
    $('#error').dialog({
    show: { effect: "fadeIn", duration: 500}
  });
    return true;
  }
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
function View(game){
  this.game = game;
  this.currentPlayer = $('#current-player');
  this.winner = $('#winner');
  this.board = $('#board table');
}

View.prototype.showWinner = function(winner){
  this.winner.html("THE WINNER IS "+ winner);
  this.winner.slideDown(1000);
}

View.prototype.renderBoard = function(boardPieces){
  for(var row = 0; row < 4; row++){
    for(var col = 0; col < 4; col++){
      if(boardPieces[row][col] > 0){
        var rowNum = row + 1;
        var colNum = col + 1;
        $('#board table tr:nth-child('+rowNum+') :nth-child('+colNum+')').css('background-color', 'Pink');
      }
      else if(boardPieces[row][col] < 0){
        var rowNum = row + 1;
        var colNum = col + 1;
        $('#board table tr:nth-child('+rowNum+') :nth-child('+colNum+')').css('background-color', 'LightGreen');
      }
    }
  }
}

View.prototype.playerStats = function(info){
  this.currentPlayer.html(info);
}

View.prototype.prepareDragDrop = function(currPlayer){
  this.renderBoard(this.game.board.allPieces);
  this.makeDraggable(currPlayer);
  this.makeDroppable();
}

View.prototype.makeDraggable = function(currPlayer){
  var activePiece = $('#active-piece');
  activePiece.css('background-color', currPlayer.color);
  activePiece.draggable();
}

View.prototype.makeDroppable = function(){
  $('.first-row').droppable({
    hoverClass: "hover",
    drop: this.executeOnDrop
  });
}

View.prototype.executeOnDrop = function(event, ui){
  var colIndex = parseInt(event.target.dataset.col);
  if(myGame.colFull(colIndex) === false){
    myGame.addToCol(parseInt(colIndex));
    myGame.activePlayer.removePiece();
    if(myGame.board.connectFour()===false){
        myGame.changeActivePlayer();
        myGame.view.resetActivePiece();
        myGame.play();
    }
    else {
      myGame.view.renderBoard(myGame.board.allPieces);
      myGame.winner = myGame.activePlayer.color;
      myGame.view.resetActivePiece();
      $('#active-piece').draggable('disable');
      myGame.play();
    }
  }
  else{
    myGame.view.resetActivePiece();
    myGame.play();
  }
}

View.prototype.resetActivePiece = function(){
  $("#active-piece").animate({
        top: "0px",
        left: "0px"
    });
}

View.prototype.fadeActivePiece = function(){
  $("#active-piece").fadeOut(500);
}

// DRIVER CODE
$( document ).ready(function() {
  myGame = new Game();
  $('#dialog').dialog({
    show: { effect: "fadeIn", duration: 800}
  });
  myGame.start();
});