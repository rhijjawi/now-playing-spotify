let $ = (selector) => document.querySelector(selector)
let getData = await axios.get('https://npbe.ramzihijjawi.me/');
let getDataJSON = getData.data
let bar = document.getElementById('progressBar');
let session_token;
let spotify = false;

function changeIfChanged(el, content) {
  if (el.innerHTML !== content) {
    el.innerHTML = content
  }
}

function changeImageIfChanged(el, url) {
  if (el.src !== url) {
    el.src = url
  }
}

function addClass(el, className) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

function removeClass(el, className) {
  if (el.classList.contains(className)) {
    el.classList.remove(className)
  }
}
const interval = setInterval(async function() {
  getData = await axios.get('https://npbe.ramzihijjawi.me/')
  getDataJSON = getData.data
  
  if(getDataJSON.hasOwnProperty('status')){
  if (getDataJSON.status == 'not_playing') {} else {}}
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
    changeIfChanged($('#status'), playingStatement)
    addClass($('#album-art'), 'spin')
    removeClass($('#album-art'), 'pause-spin')
  }
  if (!getDataJSON.is_playing) {
    changeIfChanged($('#status'), 'Paused')
    addClass($('#album-art'), 'pause-spin')
  }
  bar = document.getElementById('progressBar')
  bar.style.width = `${(getDataJSON.progress_ms/getDataJSON.item.duration_ms)*100}%`
  
  
  
  let text = document.getElementById('session')
  let session_token = text.value
  let currentSong = '';
  if (session_token == '') {}
  else {spotify = true}
  if (spotify == true) {

  let text = document.getElementById('session')
  let session_token = text.value
  let config = {
    headers: {
        'Content-Type' : 'application/json'
    }
  }
  if (getDataJSON.item.uri == currentSong) {
  }
  else {
  let data = {"session": `${session_token}`, "uris": [getDataJSON.item.uri], "offset": {"position": 0},"position_ms": getDataJSON.progress_ms}
  await axios.put('https://npbe.ramzihijjawi.me/song', data, config)
  }
  currentSong = getDataJSON.item.uri
}

  
  
}}, 1000)

