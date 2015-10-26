// Helper functions to handle rendering things to the screen.

var makeGameBoard = function(colorL, colorD, boardSize) {
  var board = [];
  for(var i = 0; i < boardSize; i++) {
    var row = [];
    for(var j = 0; j < boardSize; j++) {
      //set an initial pattern of alternating colors on each square. 
      if ( (i + j) % 2 === 0 ) {
        var color = colorL; 
      } else {
        color = colorD; 
      }
      //each square (position on the board) is represented by an object. 
      var square = {
        position: [i, j],
        color: color,
        ready: false,
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
        var squareHtml = '<img src="' + 
                          squareObj.gamePiece.imageURL + 
                          '" class="gameSquare" style="height:' + 
                          squareSize + 
                          'px; width:' + 
                          squareSize + 
                          'px" data-position="[' + 
                          rowIndex + ',' + 
                          columnIndex + 
                          ']">'
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
    movementDescription: 'how this piece moves',
    collisionDescription: 'how this piece interacts with other pieces',
    name: pieceName,
    typeOfPiece: pieceType,
    imageURL: '',
    playerBelongsTo: playerBelongsTo  // which player this piece belongs to
  }

  var row = initialPosition[0];
  var column = initialPosition[1];

  gameBoard[row][column].gamePiece = gamePiece;

  return gamePiece;
};


(function() {

  function makeManeSix(name, url, location) {
      // add a game piece to a square on the game board.
      // returns nothing
      // updates the gamePiece property of the square at 'location'
    makePiece(gameBoard, location, name);
    gameBoard[location[0]][location[1]].gamePiece.imageURL = url;
  }

  function flattenBoard(board) {
        // Takes an array of arrays of objects (the game board)
        // returns a single array of objects
   var allSquares = _.reduce(board, function(allSqr, currRow) {
      _.each(currRow, function(square) {
        allSqr.push(square);
      });
      return allSqr;
    }, []);
    return allSquares;
  }

  function findGameSquares(board) {
      // Takes the flattened game board and returns an object
      // The object has two properties:
      // evenSquares, an array of objects alternating for even numbered rows
      // oddSquares, an array of objects alternating for odd numbered rows 
      // i.e. all the squares on which pieces can be placed.
    var evenSquares = _.filter(flattenBoard(gameBoard), function(square) {
      return (square.position[0]%2 === 0) && (square.position[1]%2 !== 0);
    });

    var oddSquares = _.filter(flattenBoard(gameBoard), function(square) {
      return (square.position[0]%2 !== 0) && (square.position[1]%2 === 0);
    });

    return {evenSquares: evenSquares, oddSquares: oddSquares}
  }

  function addPiece(square) {
      // Takes a square object.
      // Add player 1's pieces if the square is in rows 0-2
      // Do nothing if the square is rows 3-4
      // Add player 2's pieces if the square is in rows 5-7
    if (square.position[0] < 3) {
      makeManeSix("player1", "static/player1.png", square.position);
    } else if (square.position[0] > 4) {
      makeManeSix("player2", "static/player2.png", square.position);
    }
  }

  function setUpBoard (gameSquares) {
      // Take an object with oddSquares and evenSquares properties
      // Sends all objects in all arrays to the addPiece function
      // returns nothing
    _.each(gameSquares.oddSquares, function(square) {
        addPiece(square)
      })
    _.each(gameSquares.evenSquares, function(square){
        addPiece(square)
      })
    }

  function markOpenSquares (position) {
    console.log("mark open squares around ", position);

    function adjacentMoves(position, whoseMove) {
      var allMoves = []
      if(whoseMove==="player1") {
        var mvX = position[0]+1;
      } else if (whoseMove === "player2") {
        var mvX = position[0]-1;
      } else {
        console.log("invalid player");
      }
      var mvY = position[1]-1;
      allMoves.push([mvX, mvY]);
      mvY = position[1]+1;
      allMoves.push([mvX, mvY]);
      return allMoves;
    }

    function findLegalMoves (allMoves) {
      var onBoard = _.filter(allMoves, function(move) {
        return (move[0] >= 0 && move[1] >=0 && move[0] < gameBoard.length && move[1] < gameBoard.length)
      });
      var validMoves = _.filter(onBoard, function(coords) {
        return gameBoard[coords[0]][coords[1]].gamePiece === '';
      });
      return _.map(validMoves, function(coords) {
        return "[" + coords[0] + "," + coords[1] + "]"
      });
    }

    function makePositionArray(str) {
      var noBrackets = str.replace(/([\[|\]])/g,"");
      var pieceLoc = noBrackets.split(",");
      pieceLoc[0] = parseInt(pieceLoc[0]);
      pieceLoc[1] = parseInt(pieceLoc[1]);
      return pieceLoc;
    }

    function whichPlayer(loc) {
      return gameBoard[loc[0]][loc[1]].gamePiece.typeOfPiece;
    }
    var whoseMove = whichPlayer(makePositionArray(position));
    var validMoves = findLegalMoves(adjacentMoves(makePositionArray(position), whoseMove));
    var squares = _.each(validMoves, function(coords) {
      $("[data-position='" + coords + "']").toggleClass("openSquare");
      $("[data-position='" + coords + "']").on('click', function(evt) {
        console.log(coords, makePositionArray(coords))
      });
    })

  }

$( document ).ready(function() {
  $('.gameBoard').on('click', 'img.gameSquare', function(evt) {
      $(".clicked").removeClass("clicked");
      $(".openSquare").off('click');
      $(".openSquare").removeClass("openSquare");
      $(this).toggleClass("clicked");
      var piecePosition = $(this).attr('data-position');
      markOpenSquares(piecePosition);
    });
});

  window.gameBoard = makeGameBoard('LightPink', 'HotPink', 8); 
  setUpBoard(findGameSquares(gameBoard));

})();

// $(window).bind('load', function(){
//     console.log($('img.gameSquare'));
// })