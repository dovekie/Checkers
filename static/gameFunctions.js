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

// call functions
  window.gameBoard = makeGameBoard(8); 
  beautifyBoard(gameBoard);
  setUpBoard(findGameSquares(flattenBoard(gameBoard)));

  window.clickHandler = function(positionArr) {
    var row = positionArr[0];
    var column = positionArr[1];
    console.log('the user clicked on square:', gameBoard[row][column]);
    renderGameBoard(gameBoard); // this must come at the end of clickHandler
  };

})();