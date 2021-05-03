//--TWITTER--//
var twitter = TwitterWebService.getInstance(
  'DNfga2j048wsurseDhZi31KyA',//API Key
  'YO3KphJpLNqFeKfkESLp6ypHzgjVjCUekVAloEGFZUiWq1Al4s'//API secret key
);
function authorize() {twitter.authorize();}
function reset() {twitter.reset();}
function authCallback(request) { return twitter.authCallback(request); }

//--SPOTIFY--//
//ACCESS_TOKEN = BQDpVNnMxFp_SJHGiJ5PvN5bFcRS0Il7TkcDBYMgTCMZmV12FQt8JlNtc6Osy5rzwJfYGVc3GWd2E2vVIRkmCSSa66cnzrYyyBCgzekdYsmwCjKA7dbLkut-IzhpYDVA_ONjurWWTzgGKTw-88trySdSGaAWNYXJTaamLqjggazRVZRbah8_uA
const client_id = '728c5521241e4841b181a99c66d3c147'
const client_secretId = 'a405338eed17448595259b28db9e35ac'
var refresh_token = "AQDZx7TWwJmTwp1G9KYsx8zW7MSSzEjaPZptopY8cjEuXsec14cJOAkZTIVvG9hToPfrDoTGkHu6YJxUQ7eNhpUQjaowjDMGluvKbvmfsw3YtZOLqccXSUSs2_gWnrjWzPg"
var username = "22z2yadt4usyzwtbfz6rlpwhy"

function getToken() {
  var endpoint = 'https://accounts.spotify.com/api/token'

  var encode = Utilities.base64Encode(client_id+":"+client_secretId, Utilities.Charset.UTF_8)
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


