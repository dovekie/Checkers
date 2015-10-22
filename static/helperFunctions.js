// Helper functions to handle rendering things to the screen.

var makeGameBoard = function(boardSize) {
  var board = [];
  for(var i = 0; i < boardSize; i++) {
    var row = [];
    for(var j = 0; j < boardSize; j++) {
      var telegraphBlue1 = '#48B9C4'; //these are 'hex' representations of colors.
      var telegraphBlue2 = '#1A3D6D';
      //set an initial pattern of alternating colors on each square. 
      if ( (i + j) % 2 === 0 ) {
        var color = telegraphBlue1; 
      } else {
        color = telegraphBlue2; 
      }
      //each square (position on the board) is represented by an object. 
      var square = {
        position: [i, j],
        color: color,
        gamePiece: '', // This is the property that will contain our gamePiece object if one is on that square. 
        text: ''
      };
      row.push(square);
    }
    board.push(row);
  }
  return board;
};

// Call this function each time you make a change and want that change to appear on the screen.
// There are more elegant ways of doing this.
var renderGameBoard = function(gameBoard) {
  $('.gameBoard').html('');
  var boardSize = gameBoard.length;
  // we scale the gameBoard to the user's screen. First we find which is smaller, the height or width of the user's browser
  var browserSize = Math.min($(window).height(), $(window).width());
  $('.gameBoard').width(browserSize - 110);
  // then we leave some room around the edges (200 pixels), and divide by the number of squares to find how large the squares should be to fill that space perfectly.
  var squareSize = (browserSize- 110) / boardSize - 2;
  gameBoard.forEach(function(rowArr, rowIndex) {
    rowArr.forEach(function(squareObj, columnIndex) {
      // Here we are creating the HTML that will be rendered to the DOM for each square. 
      // We're creating a <div> (similar to an object in JS).
      // The <div> object's properties determine how it displays on the screen.
      // Those style properties include size (height and width) in pixels (px). 
      // We're setting its background color to be the color of that squareObj. 
      // The "data" property is a hook for the click handler.
      if(squareObj.gamePiece && squareObj.gamePiece.imageURL) {
        var squareHtml = '<img src="' + squareObj.gamePiece.imageURL + '" class="gameSquare" style="height:' + squareSize + 'px; width:' + squareSize + 'px" data-position="[' + rowIndex + ',' + columnIndex + ']">'
      } else {
        var squareText = '';
        if(squareObj.gamePiece) {
          squareText = squareObj.gamePiece.name;
        }
        var squareHtml = '<div class="gameSquare" style="background-color:' + squareObj.color + '; height:' + squareSize + 'px; width:' + squareSize + 'px" data-position="[' + rowIndex + ',' + columnIndex + ']">' + squareText + '</div>';
      }
      $('.gameBoard').append(squareHtml);
    });
  });
}

// invoke the clickHandler function.
$(document).on('click', '.gameSquare', function() {
  clickHandler($(this).data('position'));
});

//Keep track of the count of all pieces added to our gameBoard. 
var totalPieceCount = {};

//initialPosition should be an array with two numbers in it. 
// those numbers should specify the 0-indexed row and column you want this piece to start at. 
// example: [1,3] would put the piece on the second row (remember we're 0-indexed) in the 4th column. 
var makePiece = function(gameBoard, initialPosition, pieceType, playerBelongsTo) {
  // make sure this piece is counted in our totalPieceCount object. 
  if(totalPieceCount[pieceType]) {
    totalPieceCount[pieceType]++;
  } else {
    totalPieceCount[pieceType] = 1;
  }

  // default player to Player1 if no player name is passed in, then defines a unique name for this gamePiece
  playerBelongsTo = playerBelongsTo || 'Player1';
  var pieceName = playerBelongsTo + ' ' + pieceType + ' #' + totalPieceCount[pieceType];

  var gamePiece = {
    movementDescription: 'use words to describe how this piece moves so your users can understand what their options are',
    collisionDescription: 'use words to explain what happens when this piece collides with another',
    name: pieceName,
    typeOfPiece: pieceType,
    imageURL: '',
    playerBelongsTo: playerBelongsTo  // specify which player this piece belongs to
  }

  var row = initialPosition[0];
  var column = initialPosition[1];

  gameBoard[row][column].gamePiece = gamePiece;

  return gamePiece;
};
