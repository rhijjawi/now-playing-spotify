let $ = (selector) => document.querySelector(selector);
var socket = io('https://npbe.ramzihijjawi.me');
//let getData = await axios.get('https://npbe.ramzihijjawi.me/');
//let getDataJSON = getData.data
let bar = document.getElementById('progressBar');
let session_token;
let spotify = false;
let config = {headers: {'Content-Type' : 'application/json','Authorisation' : 'Bearer 0000000-00000000-0000000'}}
let stillPaused = null;
let currentSong = '';
let playing = null;
let playlists = await axios.get('https://npbe.ramzihijjawi.me/playlist')
//import {changeIfChanged, changeImageIfChanged, addClass, removeClass} from "./general_functions.js"
playlists = playlists.data

async function pause(uri) {
  if (spotify == true) {
    if (listenAlong() == true) {
      if (stillPaused == false) {
        if (document.cookie.split(document.location.search.split('=')[1]+"=")[1] == undefined){
        let data = {'session': `${document.cookie.split('spotify=')[1].split(';')[0]}`, 'uris':uri}
        await axios.put('https://npbe.ramzihijjawi.me/pause', data, config)
        stillPaused = true;
        playing = false;
      }
  }}}}
async function play(uri) {
  if (spotify == true) {
    if (listenAlong() == true) {
      if (playing == false) {
        if (document.cookie.split(document.location.search.split('=')[1]+"=")[1] == undefined){
          let data = {'session': `${document.cookie.split('spotify=')[1].split(';')[0]}`, 'uris':uri}
          await axios.put('https://npbe.ramzihijjawi.me/play', data, config)
          playing = true;
          stillPaused = false;
  }}}}}

socket.emit('join', {'room':'main'})
socket.on('disconnect', ()=>{socket.emit('join', {'room':'main'})})
socket.on('music', async (data) => {
  let getDataJSON = data
  if(getDataJSON.hasOwnProperty('error')){
    if (getDataJSON.error == 'room_not_found') {changeIfChanged($('#title'), `<a>Room not found</a>`)}
    else {changeIfChanged($('#title'), `<a>${getDataJSON.error}</a>`)}
    changeIfChanged($('#status'), '')
    $('#explicit_tag').hidden = true
    changeIfChanged($('#album'), '')
    changeIfChanged($('#artist'),'')
    changeImageIfChanged($('#album-art'), './sad.png')
  }
  else if (getDataJSON.hasOwnProperty('status')){
    if (getDataJSON.status == 'not_playing') {changeIfChanged($('#title'), `<a>Not Playing</a>`)}
    changeIfChanged($('#status'), '')
    $('#explicit_tag').hidden = true
    changeIfChanged($('#album'), '')
    changeIfChanged($('#artist'),'')
    changeImageIfChanged($('#album-art'), './sad.png')
    $('#la_toggle').disabled = true
  }
  else {
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

    let session_token = document.cookie.split('spotify=')[1].split(';')[0]
    if (session_token == undefined) {}
    else {
      if (document.cookie.split('spotify=')[1].split(';')[0] !== undefined) {
        spotify = true
      }
    }
    if (spotify == true) {
    if ((currentSong == getDataJSON.item.uri) == false) {
      if (document.cookie.split(document.location.search.split('=')[1]+"=")[1] == undefined){
        if (listenAlong() == true) {
          let data = {"session": `${session_token}`, "uris": [getDataJSON.item.uri], "offset": {"position": 0},"position_ms": getDataJSON.progress_ms}
          await axios.put('https://npbe.ramzihijjawi.me/song', data, config)
    }}}
    else {}
    currentSong = getDataJSON.item.uri
}}});