let $ = (selector) => document.querySelector(selector)
let getData = await axios.get('https://npbe.ramzihijjawi.me/');
let getDataJSON = "";
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
  let volume = `@ ${getDataJSON.device.volume_percent} volume`
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
}, 1000)
