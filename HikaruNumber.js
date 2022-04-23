var ChessWebAPI = require('chess-web-api');
var chessAPI = new ChessWebAPI();

async function findHighestBulletWinPlayer(playerName, gamemode)
{
  var response = await chessAPI.getPlayerStats(playerName);  
  const bestWinningGame = response.body[gamemode]["best"]["game"]
  var gameId = bestWinningGame.split('/')[5]
  
  response = await chessAPI.getGameByID(gameId)
  top = response.body["players"]["top"]
  bottom = response.body["players"]["bottom"]

  player = top;
  loserRating = top["rating"]
  if (top["username"] == playerName){
    player = bottom;
    loserRating = bottom["rating"]
  }

  console.log(playerName + " (" + loserRating + ")")

  return player["username"]
}

async function printHikaruNumber(player, gamemode)
{
  originalPlayer = player
  steps_from_hikaru = 0
  gamemodeString = "chess_" + gamemode

  while (player != "Hikaru"){
    steps_from_hikaru += 1
    player = await findHighestBulletWinPlayer(player, gamemodeString)
  }

  var hikaruStats = await chessAPI.getPlayerStats("Hikaru");
  console.log("Hikaru ("  + hikaruStats.body[gamemodeString]["last"]["rating"] + ")")  

  console.log(originalPlayer + " is " + steps_from_hikaru + " steps from Hikaru")
}

printHikaruNumber("brennyb", "blitz")
