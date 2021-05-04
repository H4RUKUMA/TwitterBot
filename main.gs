var ss = SpreadsheetApp.openById("186-1WTpRg3rJGxq5QwTBQ9eNh10aC4ohy29ZW2zByxw");
var docSheet = ss.getSheetByName("DOC");

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
  return JSON.parse(content).access_token
}

function getNewAlbumId(token, offset) {
  var endpoint = 'https://api.spotify.com/v1/browse/new-releases?country=JP&limit=1&offset=' + offset
  var options = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + token
    }
  }
  var response = UrlFetchApp.fetch(endpoint, options)
  var json = JSON.parse(response.getContentText());
  var id = String(json["albums"]["items"][0]["id"])

  return id
}

function getNewAlbumInfo(token, id) {
  var endpoint = "https://api.spotify.com/v1/albums/" + id + "?market=JP"
  var options = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + token
    }
  }
  var response = UrlFetchApp.fetch(endpoint, options)
  var json = JSON.parse(response.getContentText());
  var artist_name = json["artists"][0]["name"]
  var album_name = json["name"]
  var popularity = json["popularity"]
  var release_date = json["release_date"]
  var upc = json["external_ids"]["upc"]
  var url = json["external_urls"]["spotify"]

  var info = {"artist_name":artist_name, "album_name":album_name,"popularity":popularity,"release_date":release_date,"upc":upc,"url":url};
  Logger.log(info)
  return info
}

function tweetNewAlbum() {
  var token = getToken_Spotify()

  do {
    var offset = String(Math.floor(Math.random() * 100))
    var id = getNewAlbumId(token, offset)
    var info = getNewAlbumInfo(token, id)
    var text = "-新着音楽-"+"\n"+"【リリース日】" + info.release_date + "\n" + "【人気度】" + info.popularity + "\n" + info.album_name + " / " + info.artist_name + "\n" + info.url
  } while (info.popularity <= 35)

  var service  = twitter.getService();
  Logger.log(text)
  var response = service.fetch('https://api.twitter.com/1.1/statuses/update.json', {
    method: 'post',
    payload: { status: text }
  });
}


//----testing-----//
function kickAnalyze() {
  var token = getToken_Spotify()
  var id = '66FIsRuMv9RaGNeTBvBCWz'
  var info = analizeTrack(token,id)
  Logger.log(info)
}

function analizeTrack(token, id) {
  var endpoint = 'https://api.spotify.com/v1/audio-features?ids='+ id
  var options = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + token
    }
  }
  var response = UrlFetchApp.fetch(endpoint, options)
  var json = JSON.parse(response.getContentText());

  var danceability = json["audio_features"][0]["danceability"]
  var energy = json["audio_features"][0]["energy"]
  var keyNum = json["audio_features"][0]["key"]
  var loudness = json["audio_features"][0]["loudness"]
  var modeNum = json["audio_features"][0]["mode"]
  var speechiness = json["audio_features"][0]["speechiness"]
  var acousticness = json["audio_features"][0]["acousticness"]
  var instrumentalness = json["audio_features"][0]["instrumentalness"]
  var liveness = json["audio_features"][0]["liveness"]
  var valence = json["audio_features"][0]["valence"]
  var tempo = json["audio_features"][0]["tempo"]

  var keyArray = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
  var modeArray = ["minor","major"]
  var key = keyArray[keyNum] + " " + modeArray[modeNum]

  var info = [danceability,energy,key,loudness,speechiness,acousticness,instrumentalness,liveness,valence,tempo]

  return info
}

