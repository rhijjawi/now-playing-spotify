let $ = (selector) => document.querySelector(selector);
let getData = await axios.get('https://npbe.ramzihijjawi.me/');
let getDataJSON = getData.data
let bar = document.getElementById('progressBar');
let session_token;
let spotify = false;
let config = {headers: {'Content-Type' : 'application/json','Authorisation' : 'Bearer 0000000-00000000-0000000'}}
let stillPaused = false;
let currentSong = '';
let playlists = await axios.get('https://npbe.ramzihijjawi.me/playlist')
playlists = playlists.data
/*
for (i of playlists.items) {
  let playlistsdiv = document.getElementById('playlists')
  let div = document.createElement('div')
  let span = document.createElement('span')
  span.className = 'ptitle'
  span.innerHTML = i.name
  div.className = 'playlist'
  //div.appendChild(span);
  //playlistsdiv.appendChild(div)
}
*/

const interval = setInterval(async function() {
  getData = await axios.get('https://npbe.ramzihijjawi.me/')
  getDataJSON = getData.data
  
  if(getDataJSON.hasOwnProperty('status')){
    if (getDataJSON.status == 'not_playing') {changeIfChanged($('#title'), `<a>Not Playing</a>`)} 
    else {}
    }
  else {
    let volume = `@ ${getDataJSON.device.volume_percent}% volume`
    let playingStatement = `Playing on <span class="bold">${getDataJSON['device']['name']}</span> ${volume}`
    changeImageIfChanged($('#album-art'), getDataJSON.item.album.images[0].url)
    changeIfChanged($('#title'), `<a href="${getDataJSON.item.external_urls.spotify}">${getDataJSON.item.name}</a>`)
    changeIfChanged(
      $('#album'),
      `<span class="muted">on</span> <a href="${getDataJSON.item.album.external_urls.spotify}">${getDataJSON.item.album.name}</a>`,
    )
    changeIfChanged(
      $('#artist'),
      `<span class="muted">by</span> <a href="${getDataJSON.item.album.artists[0].external_urls.spotify}">${getDataJSON.item.album.artists[0].name}</a>`,
    )
    if (getDataJSON.is_playing) {
      stillPaused = false;
      changeIfChanged($('#status'), playingStatement)
      addClass($('#album-art'), 'spin')
      removeClass($('#album-art'), 'pause-spin')
    }
    if (!getDataJSON.is_playing) {
      changeIfChanged($('#status'), 'Paused')
      addClass($('#album-art'), 'pause-spin')
      pause([getDataJSON.item.uri]);
    }
    bar = document.getElementById('progressBar')
    bar.style.width = `${(getDataJSON.progress_ms/getDataJSON.item.duration_ms)*100}%`



    let text = document.getElementById('session');
    let session_token = text.value
    if (session_token == '') {}
    else {spotify = true}
    if (spotify == true) {

    let text = document.getElementById('session')
    let session_token = text.value

    if ((currentSong == getDataJSON.item.uri) == false) {
        let data = {"session": `${session_token}`, "uris": [getDataJSON.item.uri], "offset": {"position": 0},"position_ms": getDataJSON.progress_ms}
        await axios.put('https://npbe.ramzihijjawi.me/song', data, config)
    }
    else {}
    currentSong = getDataJSON.item.uri
}

  
  
}}, 1000)

