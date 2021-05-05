//--SHEET---//
var ss = SpreadsheetApp.openById("186-1WTpRg3rJGxq5QwTBQ9eNh10aC4ohy29ZW2zByxw");
var docSheet = ss.getSheetByName("DOC");
var analyzeSheet = ss.getSheetByName("Analyze");

//--TWITTER--//
var twitter = TwitterWebService.getInstance(
  'fJVnyY70t0WobIjwL1sttkKK2',//API Key
  'cpTO24b2fCeo5JgEhYwfXTRnEJwJbhNTonpjn0ZAWuklcwgb8D'//API secret key
);
function authorize_Twitter() {twitter.authorize();}
function reset_Twitter() {twitter.reset();}
function authCallback(request) { return twitter.authCallback(request); }
function tweet(text,re_id,image_blob) {
  var service  = twitter.getService();
  var endPointStatus = 'https://api.twitter.com/1.1/statuses/update.json';
  var endPointMedia  = 'https://upload.twitter.com/1.1/media/upload.json';

  if (image_blob == null) {
    var payload = {status : text, in_reply_to_status_id : re_id}
  } else {
    var image_64  = Utilities.base64Encode(image_blob.getBytes());
    var img_option = { 
      'method' : "POST", 
      'payload': {
      'media_data': image_64
    } 
    };
    var image_upload = JSON.parse(service.fetch(endPointMedia, img_option));
    var payload = {status : text, media_ids:image_upload['media_id_string'],in_reply_to_status_id : re_id}
  }

  var response = service.fetch(endPointStatus, {
    method: 'post',
    payload: payload
  });

  var tw_id = JSON.parse(response).id_str;
  return tw_id
}

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

function tweetNewAlbum() {
  var token = getToken_Spotify()
  do {
    var offset = String(Math.floor(Math.random() * 100))
    var id = getNewAlbumId(token, offset)
    var info = getNewAlbumInfo(token, id)
  } while (info.popularity <= 35)
  var hashtag = "#" + String(info.artist_name).replace(/[\s\t\n]/g,"");
  var text = "-新着音楽-"+"\n"+"【リリース日】" + info.release_date + "\n" + "【人気度】" + info.popularity + "\n" + info.album_name + " / " + info.artist_name + "\n" + hashtag + "\n" + info.url
  var tw_id1 = tweet(text)
  var parameters = createAnalyzeGraph(token,String(id),info.popularity,info.album_name,info.artist_name)
  var chart_blob = parameters.chart_blob
  
  if (parameters.tempo_min == parameters.tempo_max) {
    var analyze_text = "【分析結果】 \n" + "BPM:"+ parameters.tempo_min
  } else {
    var analyze_text = "【分析結果】 \n" + "BPM:"+ parameters.tempo_min + "〜" + parameters.tempo_max
  }
  var tw_id2 = tweet(analyze_text,tw_id1,chart_blob)
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
  var image_url = json["images"][0]["url"]
  var res = UrlFetchApp.fetch(image_url)
  var blob = res.getBlob()
  var image = blob.getAs('image/png').setName(id+".png")
  var image_64 = Utilities.base64Encode(blob.getBytes());

  var info = {"artist_name":artist_name, "album_name":album_name,"popularity":popularity,"release_date":release_date,"upc":upc,"url":url,"image_url":image_url,"image":image,"image_64":image_64,"image_blob":blob};
  return info
}

function createAnalyzeGraph(token,id,popularity,album,artist) {
  var token = getToken_Spotify();
  var para = analyze(token,id)
  para.popularity = popularity
  para.album = album
  para.artist = artist
  Logger.log(para)
  analyzeSheet.getRange(1,2).setValue(para.artist)
  analyzeSheet.getRange(2,2).setValue(para.album)
  analyzeSheet.getRange(3,2).setValue(para.duration_ms_sum)
  analyzeSheet.getRange(4,2).setValue(para.duration_ms_avr)
  analyzeSheet.getRange(5,2).setValue(para.tempo_min)
  analyzeSheet.getRange(6,2).setValue(para.tempo_max)
  analyzeSheet.getRange(7,2).setValue(para.popularity)
  analyzeSheet.getRange(8,2).setValue(para.danceability)
  analyzeSheet.getRange(9,2).setValue(para.energy)
  analyzeSheet.getRange(10,2).setValue(para.acousticness)
  analyzeSheet.getRange(11,2).setValue(para.instrumentalness)
  analyzeSheet.getRange(12,2).setValue(para.valence)
  //---------create---------//
  var chart = analyzeSheet.getCharts()[0];
  var newchart = chart
    .modify()
    .setOption('title','AI分析')
    .build();
  analyzeSheet.updateChart(newchart);
  var chart_blob = chart.getBlob();
  para.chart_blob = chart_blob
  return para
}

function analyze(token,album_id) {
  var token = getToken_Spotify();
  var mathematics = new Mathematics();
  var endpoint = 'https://api.spotify.com/v1/albums/'+album_id+'/tracks?offset=0&limit=30&market=JP'
  var options = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + token
    }
  }
  var response = UrlFetchApp.fetch(endpoint, options)
  var json = JSON.parse(response.getContentText());
  var track_length = Number(json["total"])
  var info = []
  var track_id = []
  var danceability = [], energy = [], key = [], loudness = [], speechiness = [], acousticness = [], instrumentalness = [], liveness = [], valence = [], tempo = [], duration_ms = []
  for(i = 0; i < track_length; i++) {
    if (String(json["items"][i]["is_playable"]) == "true") {
      track_id[i] = String(json["items"][i]["id"])
      info[i] = analyzeTrack(token, track_id[i])
      danceability[i] = info[i].danceability*100
      energy[i] = info[i].energy*100
      key[i] = info[i].key
      loudness[i] = info[i].loudness*100
      speechiness[i] = info[i].speechiness*100
      acousticness[i] = info[i].acousticness*100
      instrumentalness[i] = info[i].instrumentalness*100
      liveness[i] = info[i].liveness*100
      valence[i] = info[i].valence*100
      tempo[i] = info[i].tempo
      duration_ms[i] = info[i].duration_ms
    } else {}
  }
  var danceability_avr = Math.round(mathematics.average(danceability))
  var energy_avr = Math.round(mathematics.average(energy))
  var acousticness_avr = Math.round(mathematics.average(acousticness))
  var instrumentalness_avr = Math.round(mathematics.average(instrumentalness))
  var valence_avr = Math.round(mathematics.average(valence))
  var tempo_range = mathematics.range(tempo)
  var duration_ms_avr = Math.round(mathematics.average(duration_ms))
  var duration_ms_sum = Math.round(mathematics.sum(duration_ms))
  var parameters = {"danceability":danceability_avr,"energy":energy_avr,"acousticness":acousticness_avr,"instrumentalness":instrumentalness_avr,"valence":valence_avr,"tempo_min":tempo_range[0],"tempo_max":tempo_range[1],"duration_ms_avr":duration_ms_avr, "duration_ms_sum":duration_ms_sum};
  return parameters
}

function analyzeTrack(token, id) {
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
  var duration_ms = json["audio_features"][0]["duration_ms"]

  var keyArray = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"], modeArray = ["minor","major"]
  var key = keyArray[keyNum] + " " + modeArray[modeNum]

  var info = [danceability,energy,key,loudness,speechiness,acousticness,instrumentalness,liveness,valence,tempo]
  var info = {"danceability":danceability, "energy":energy,"key":key, "loudness":loudness, "speechiness":speechiness, "acousticness":acousticness,"instrumentalness":instrumentalness, "liveness":liveness, "valence":valence, "tempo":tempo,"duration_ms":duration_ms};

  return info
}

//--TESTING--//
function test() {
  var result = scraping("ummmm")
  Logger.log(result)
}

function scraping(searchWord) {
  
}