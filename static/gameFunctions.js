(function() {
  window.gameBoard = makeGameBoard(8); 

  function alternateColors(colorL, colorD) {

    var seedList = new Array(8);

    function pickColor(num) {
      if (num%2 !== 0) {
        return colorL;
      } else {
        return colorD;
      }
    }

    var newColorListEvens = _.map(seedList, function(nullValue, index) {
      return pickColor(index);
    })

    var newColorListOdds = _.map(seedList, function(nullValue, index) {
      return pickColor(index+1);
    })

    return {evenColors: newColorListEvens, oddColors: newColorListOdds};
  }


  function beautifyBoard (board) {
    var lightColor = "LightPink";
    var darkColor = "HotPink";

    var colorArrays = alternateColors(lightColor, darkColor);

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

  beautifyBoard(gameBoard);

  function makeManeSix(name, url, location) {
    makePiece(gameBoard, location, name);
    gameBoard[location[0]][location[1]].gamePiece.imageURL = url;
  }

   var allSquares = _.reduce(gameBoard, function(allSqr, currRow) {
      _.each(currRow, function(square) {
        allSqr.push(square);
      });
      return allSqr;
  }, []);

  var evenSquares = _.filter(allSquares, function(square) {
    return (square.position[0]%2 === 0) && (square.position[1]%2 !== 0);
  });

  var oddSquares = _.filter(allSquares, function(square) {
    return (square.position[0]%2 !== 0) && (square.position[1]%2 === 0);
  });

  _.each(oddSquares, function(square){
    if (square.position[0] < 3) {
      var player = "player1";
      var url = "static/player1.png";
      makeManeSix(player, url, square.position);
    } else if (square.position[0] > 4) {
      var player = "player2";
      var url = "static/player2.png";
      makeManeSix(player, url, square.position);
    }
  })

  _.each(evenSquares, function(square){
    if (square.position[0] < 3) {
      var player = "player1";
      var url = "static/player1.png";
      makeManeSix(player, url, square.position);
    } else if (square.position[0] > 4) {
      var player = "player2";
      var url = "static/player2.png";
      makeManeSix(player, url, square.position);
    }
  })

  window.clickHandler = function(positionArr) {
    var row = positionArr[0];
    var column = positionArr[1];
    console.log('the user clicked on square:', gameBoard[row][column]);
    renderGameBoard(gameBoard); // this must come at the end of clickHandler
  };

})();