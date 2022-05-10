let $ = (selector) => document.querySelector(selector);
var socket = io('https://npbe.ramzihijjawi.me');
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
}}

function rmEventListener(func) {
    document.getElementById('prep_btn').removeEventListener('click', func)
}

function listenAlong() {
    return $('#la_toggle').checked
}

function getAuth() {
    for (i of document.cookie.split(' ')) {
        if (i.startsWith('spotify')) {
            return i.split('=')[1].split(';')[0]
        }
    }
    return false
}

async function getUser() {
    if (window.location.search !== ''){
        document.getElementById('link').href = window.location.href
    }
    let config = {headers: {'Content-Type' : 'application/json','Authorisation' : 'Bearer 0000000-00000000-0000000'}}
    if(getAuth() !== false) {
        let r = await axios.post('https://npbe.ramzihijjawi.me/me', {'cookie': `${getAuth()}`}, config)
        if (r.data.hasOwnProperty('error')) {
            //document.cookie = "spotify=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            alert(r.data.error)
        }
        else {
            let x = document.createElement('span')
            let br = document.createElement('br')
            x.className = "muted"
            x.innerHTML = `Signed in as ${r.data.display_name}`
            document.getElementsByClassName('track-info')[0].appendChild(br)
            document.getElementsByClassName('track-info')[0].appendChild(x)
            document.getElementById('prep_btn').innerHTML = `Signed in as ${r.data.display_name}`;
            document.getElementById('prep_btn').hidden = true;
        }
    }
}

document.getElementById('makeroom').addEventListener('click', async function makeroom() {
    if (getAuth() !== false){
        let m = await axios.post('https://npbe.ramzihijjawi.me/me', {'cookie': `${getAuth()}`})
        socket.emit('make_room', {'cookie': `${getAuth()}`, 'username':m.data.display_name})
        socket.on('room_created', (data) => {
            document.cookie = data.set
            window.open(data.redir)
        });
    }
});

document.getElementById('la_toggle').addEventListener('click', async function() {
    document.cookie = `la_toggle=${document.getElementById('la_toggle').checked}`;
});

async function setTitle() {
    let n = await axios.get(`https://npbe.ramzihijjawi.me/room${document.location.search}`)
    if (n.headers["host"] !== undefined) {
        document.title = `${n.headers["host"]}'s Spotify Room`;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    for (i of document.cookie.split(' ')) {
        if (i.startsWith('la_toggle')){
            $('#la_toggle').checked = i.split('=')[1].split(';')[0]
        }

    }
});
document.addEventListener('DOMContentLoaded', getUser());