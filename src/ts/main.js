let $ = (selector) => document.querySelector(selector);
var socket = io('https://npbe.ramzihijjawi.me', {closeOnBeforeunload:false});
let bar = $('#progressBar');
let spotify = false;
let config = {headers: {'Content-Type' : 'application/json','Authorisation' : 'Bearer 0000000-00000000-0000000'}}
let stillPaused = null;
let playing = null;
let currentSong = '';
let playlists = await axios.get('https://npbe.ramzihijjawi.me/playlist');
playlists = playlists.data

async function pause(uri) {
  if (spotify == true) {
    if (listenAlong() == true) {
      if (stillPaused == false) {
        if (getAuth('spotify') !== false){
        let data = {'session': `${getAuth('spotify')}`, 'uris':uri};
        await axios.put('https://npbe.ramzihijjawi.me/pause', data, config);
        stillPaused = true;
        playing = false;
      }
  }}}}
async function play(uri) {
  if (spotify == true) {
    if (listenAlong() == true) {
      if (playing == false) {
        if (getAuth('spotify') !== false){
          let data = {'session': `${getAuth('spotify')}`, 'uris':uri};
          await axios.put('https://npbe.ramzihijjawi.me/play', data, config);
          playing = true;
          stillPaused = false;
}}}}}

socket.emit('join', {'room':'main'});
socket.on('disconnect', ()=>{
  socket.emit('join', {'room':'main'});
  $('#indicator').className = 'dot-r';
})
socket.on('music', async (data) => {
  $('#indicator').className = 'dot-g';
  let getDataJSON = data;
  if(getDataJSON.hasOwnProperty('error')){
    if (getDataJSON.error == 'room_not_found') {changeIfChanged($('#title'), `<a>Room not found</a>`);}
    else {changeIfChanged($('#title'), `<a>${getDataJSON.error}</a>`);}
    changeIfChanged($('#status'), '')
    changeIfChanged($('#album'), '')
    changeIfChanged($('#artist'),'')
    changeImageIfChanged($('#album-art'), './sad.png')
    addClass($('#album-art'), 'no-spin')
    removeClass($('#album-art'), 'spin')
    removeClass($('#album-art'), 'pause-spin')
    $('#explicit_tag').hidden = true
    $('#la_toggle').disabled = true
    $('#la_toggle').parentElement.style.display='none'
    $('#progressBar').style.width= '0%'
  }
  else if (getDataJSON.hasOwnProperty('status')){
    if (getDataJSON.status == 'not_playing') {changeIfChanged($('#title'), `<a>Not Playing</a>`)}
    changeIfChanged($('#status'), '')
    changeIfChanged($('#album'), '')
    changeIfChanged($('#artist'),'')
    changeImageIfChanged($('#album-art'), './sad.png')
    addClass($('#album-art'), 'no-spin')
    removeClass($('#album-art'), 'spin')
    removeClass($('#album-art'), 'pause-spin')
    $('#explicit_tag').hidden = true
    $('#la_toggle').disabled = true
    $('#la_toggle').parentElement.style.display='none'
    $('#progressBar').style.width= '0%'
  }
  else {
    $('#la_toggle').parentElement.style.display='inline-block'
    $('#la_toggle').disabled = false
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
    if (getDataJSON.item.explicit) {
      $('#explicit_tag').hidden = false
    }
    if (!getDataJSON.item.explicit){
      $('#explicit_tag').hidden = true
    }
    bar = document.getElementById('progressBar')
    bar.style.width = `${(getDataJSON.progress_ms/getDataJSON.item.duration_ms)*100}%`

    if (getAuth('spotify') == false) {}
    else {
        spotify = true
    }
    if (spotify == true) {
      if ((currentSong == getDataJSON.item.uri) == false) {
        if (getAuth('spotify') !== false){
          if (listenAlong() == true) {
            let data = {"session": `${getAuth('spotify')}`, "uris": [getDataJSON.item.uri], "offset": {"position": 0},"position_ms": getDataJSON.progress_ms}
            await axios.put('https://npbe.ramzihijjawi.me/song', data, config)
    }}}
    else {}
    currentSong = getDataJSON.item.uri
}}});
