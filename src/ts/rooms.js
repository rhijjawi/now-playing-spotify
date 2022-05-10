let $ = (selector) => document.querySelector(selector);
var socket = io('https://npbe.ramzihijjawi.me', {closeOnBeforeunload:false});
//let getData = await axios.get(`https://npbe.ramzihijjawi.me/room${document.location.search}`);
//let getDataJSON = getData.data
let bar = document.getElementById('progressBar');
let spotify = false;
let config = {headers: {'Content-Type' : 'application/json','Authorisation' : 'Bearer 0000000-00000000-0000000'}}
let stillPaused = false;
let playing = false;
let currentSong = '';
socket.emit('join', {'room':document.location.search.split('=')[1]})

async function pause(uri) {
    if (spotify == true) {
      if (stillPaused == false) {
        if (getAuth() == undefined){
        let data = {'session': `${getAuth()}`, 'uris':uri}
        await axios.put('https://npbe.ramzihijjawi.me/pause', data, config)
        stillPaused = true;
        playing = false;
      }
  }}}

async function play(uri) {
    if (spotify == true) {
      stillPaused = false;
        if (playing == false) {
          if (getAuth() !== false){
              let data = {'session': `${getAuth()}`, 'uris':uri}
              await axios.put('https://npbe.ramzihijjawi.me/play', data, config)
              playing = true;
  }}}}

socket.on('disconnect', ()=>{socket.emit('join', {'room':document.location.search.split('=')[1]})})
socket.on('room_music', async (data) => {
  let getDataJSON = data
  if(getDataJSON.hasOwnProperty('error')){
    if (getDataJSON.error == 'room_not_found') {changeIfChanged($('#title'), `<a>Room not found</a>`)}
    else {changeIfChanged($('#title'), `<a>${getDataJSON.error}</a>`)}
    changeIfChanged($('#status'), '')
    changeIfChanged($('#link_cont'), '')
    changeIfChanged($('#album'), '')
    changeIfChanged($('#artist'),'')
    changeImageIfChanged($('#album-art'), './sad.png')
  }
  else if (getDataJSON.hasOwnProperty('status')){
    if (getDataJSON.status == 'not_playing') {
    changeIfChanged($('#title'), `<a>Not Playing</a>`)}
    else {changeIfChanged($('#title'), getDataJSON.status)}
    changeIfChanged($('#status'), '')
    changeIfChanged($('#link_cont'), '')
    changeIfChanged($('#album'), '')
    changeIfChanged($('#artist'),'')
    changeImageIfChanged($('#album-art'), './sad.png')
  }
  else {
    changeIfChanged($('#status'), '')
    //let volume = `@ ${getDataJSON.device.volume_percent}% volume`
    //let playingStatement = `Playing on <span class="bold">${getDataJSON['device']['name']}</span> ${volume}`
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
      play([getDataJSON.item.uri])
      playing = true;
      stillPaused = false;
      //changeIfChanged($('#status'), playingStatement)
      addClass($('#album-art'), 'spin')
      removeClass($('#album-art'), 'pause-spin')
    }
    if (!getDataJSON.is_playing) {
      playing = false;
      //changeIfChanged($('#status'), 'Paused')
      addClass($('#album-art'), 'pause-spin')
      pause([getDataJSON.item.uri]);
      stillPaused = true;
    }
    if (getDataJSON.item.explicit) {
      $('#explicit_tag').hidden = false
    }
    if (!getDataJSON.item.explicit){
      $('#explicit_tag').hidden = true
    }
    bar = document.getElementById('progressBar')
    bar.style.width = `${(getDataJSON.progress_ms/getDataJSON.item.duration_ms)*100}%`

    document.getElementById('link').href = window.location.href;
    if (getAuth() !== false) {}
    else {spotify = true}
    if (spotify == true) {
    if ((currentSong == getDataJSON.item.uri) == false) {
      if (getAuth() == undefined){
        let data = {"session": `${getAuth()}`, "uris": [getDataJSON.item.uri], "offset": {"position": 0},"position_ms": getDataJSON.progress_ms}
        await axios.put('https://npbe.ramzihijjawi.me/song', data, config)
    }}
    else {}
    currentSong = getDataJSON.item.uri
}

  
  
}})
const interval = setInterval(async function() {
  socket.emit('keep_alive', {'room':document.location.search.split('=')[1], 'cookie':getAuth()})
}, 1000);

