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

async function pause(uri) {
if (spotify == true) {
    if (stillPaused == false) {
    let data = {"session": `${session_token}`, "uri":uri}
    await axios.put('https://npbe.ramzihijjawi.me/pause', data, config)
    stillPaused = true;
}}}

async function makeroom() {
    let r = await axios.post('https://npbe.ramzihijjawi.me/rooms', {"cookie": document.cookie.split('spotify=')[1]})
    document.cookie = r.data.set
    window.open(r.data.redir)
}
  