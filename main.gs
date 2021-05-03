//--SPOTIFY--//
//CLIENT_ID = 728c5521241e4841b181a99c66d3c147
//CLIENT_SECRET_ID = a405338eed17448595259b28db9e35ac
//ACCESS_TOKEN = BQDpVNnMxFp_SJHGiJ5PvN5bFcRS0Il7TkcDBYMgTCMZmV12FQt8JlNtc6Osy5rzwJfYGVc3GWd2E2vVIRkmCSSa66cnzrYyyBCgzekdYsmwCjKA7dbLkut-IzhpYDVA_ONjurWWTzgGKTw-88trySdSGaAWNYXJTaamLqjggazRVZRbah8_uA
//REFRESH_TOKEN = AQDZx7TWwJmTwp1G9KYsx8zW7MSSzEjaPZptopY8cjEuXsec14cJOAkZTIVvG9hToPfrDoTGkHu6YJxUQ7eNhpUQjaowjDMGluvKbvmfsw3YtZOLqccXSUSs2_gWnrjWzPg


var refresh_token = "AQDZx7TWwJmTwp1G9KYsx8zW7MSSzEjaPZptopY8cjEuXsec14cJOAkZTIVvG9hToPfrDoTGkHu6YJxUQ7eNhpUQjaowjDMGluvKbvmfsw3YtZOLqccXSUSs2_gWnrjWzPg"
var username = "22z2yadt4usyzwtbfz6rlpwhy"

function getToken() {
  var endpoint = 'https://accounts.spotify.com/api/token'

  var encode = Utilities.base64Encode("728c5521241e4841b181a99c66d3c147:a405338eed17448595259b28db9e35ac", Utilities.Charset.UTF_8)
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


//認証用インスタンスの生成
var twitter = TwitterWebService.getInstance(
  'DNfga2j048wsurseDhZi31KyA',//API Key
  'YO3KphJpLNqFeKfkESLp6ypHzgjVjCUekVAloEGFZUiWq1Al4s'//API secret key
);

//アプリを連携認証する
function authorize() {
  twitter.authorize();
}
 
//認証を解除する
function reset() {
  twitter.reset();
}
 
//認証後のコールバック
function authCallback(request) {
  return twitter.authCallback(request);
}