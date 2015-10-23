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

  function alternateColors(colorL, colorD) {
      // Take two colors (strings) and return an object
      // The object has two properties:
      // evenColors, an array of color strings alternating for even numbered rows
      // oddColors, an array of color strings alternating for odd numbered rows
      // as on a chessboard

    // declare an array of the required length. (8 is hardcoded but doesn't need to be)
    var seedList = new Array(8);

    function pickColor(num) {
        // Takes a number and returns either one color string or the other
      if (num%2 !== 0) {
        return colorL;
      } else {
        return colorD;
      }
    }

    // create the first array of colors (evens)
    var newColorListEvens = _.map(seedList, function(nullValue, index) {
      return pickColor(index);
    })

    // offset pickColor by 1 to create the second arry (odds)
    var newColorListOdds = _.map(seedList, function(nullValue, index) {
      return pickColor(index+1);
    })

    return {evenColors: newColorListEvens, oddColors: newColorListOdds};
  }

  function beautifyBoard (board) {
      // Take a preexisting game board and improve the colors.
      // returns nothing.
      // colors are hardcoded but don't need to be.

    var lightColor = "LightPink";
    var darkColor = "HotPink";

    // Create the color array object using the chosen colors
    var colorArrays = alternateColors(lightColor, darkColor);

    // go through each row in the board
    // map the even color array onto even rows
    // and the odd color array onto odd rows
    // updating each square object with the color in the color array.
      _.each(board, function(row, rIndex){

        if (rIndex%2 !== 0) { 
          var colorList = colorArrays.evenColors;
        } else {
          var colorList = colorArrays.oddColors;
        }

        board[rIndex] = _.map(colorList, function(color, sIndex) {
          var newSquare = {
            position: [rIndex, sIndex],
            color: color,
            gamePiece: '',
            text: ''
          }
          return newSquare;
        });

      });
  }

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

$( document ).ready(function() {
  $('.gameBoard').on('click', '.gameSquare', function(evt) {
      console.log($(this).css('border'));
      $(this).toggleClass("clicked");
    });
});
// invoke the clickHandler function.
// $('.gameSquare').on('click', function() {
//   console.log($(this));
// });
  // window.clickHandler = function(positionArr) {
  //   // var row = positionArr[0];
  //   // var column = positionArr[1];
  //   // var selectedSquare = gameBoard[row][column];
  //   // console.log('the user clicked on square:', gameBoard[row][column]);
  //   console.log(this);
  //   // $("#div").css("border", "1px solid green !important");
  //   renderGameBoard(gameBoard); // this must come at the end of clickHandler
  // };

// call functions
  window.gameBoard = makeGameBoard(8); 
  beautifyBoard(gameBoard);
  setUpBoard(findGameSquares(gameBoard));

})();