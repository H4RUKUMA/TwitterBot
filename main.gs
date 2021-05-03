//--TWITTER--//
var twitter = TwitterWebService.getInstance(
  'fJVnyY70t0WobIjwL1sttkKK2',//API Key
  'cpTO24b2fCeo5JgEhYwfXTRnEJwJbhNTonpjn0ZAWuklcwgb8D'//API secret key
);
function authorize_Twitter() {twitter.authorize();}
function reset_Twitter() {twitter.reset();}
function authCallback(request) { return twitter.authCallback(request); }

//--SPOTIFY--//
var client_id = '728c5521241e4841b181a99c66d3c147';
var client_secretid = 'a405338eed17448595259b28db9e35ac';
var refresh_token = "AQDZx7TWwJmTwp1G9KYsx8zW7MSSzEjaPZptopY8cjEuXsec14cJOAkZTIVvG9hToPfrDoTGkHu6YJxUQ7eNhpUQjaowjDMGluvKbvmfsw3YtZOLqccXSUSs2_gWnrjWzPg"
var username = "22z2yadt4usyzwtbfz6rlpwhy"

function getToken_Spotify() {
  var endpoint = 'https://accounts.spotify.com/api/token'

  var encode = Utilities.base64Encode(client_id+":"+client_secretid, Utilities.Charset.UTF_8)
  var options = {
    'method': 'post',
    'contentType': 'application/x-www-form-urlencoded',
    'headers': {
      'Authorization': 'Basic ' + encode
    },
    'payload': {
      'grant_type': 'refresh_token',
      'refresh_token': refresh_token
    },
    'muteHttpExceptions': true
  }

  var response = UrlFetchApp.fetch(endpoint, options)
  var content = response.getContentText("UTF-8")
  Logger.log(JSON.parse(content).access_token)
  return JSON.parse(content).access_token
}

function getNewReleasedAlbums(token,offset) {
  var endpoint = 'https://api.spotify.com/v1/browse/new-releases?country=JP&limit=1&offset=' + offset
  var options = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + token
    }
  }
  var response = UrlFetchApp.fetch(endpoint, options)
  var json=JSON.parse(response.getContentText());
  var artist = json["albums"]["items"][0]["artists"][0]["name"]
  Logger.log("Artist: "+ artist)
  Logger.log(response)
}

function tweet() {
  var token = getToken_Spotify()
  var offset = String(Math.floor(Math.random() * 100))
  var uri = getNewReleasedAlbums(token,offset)
}

