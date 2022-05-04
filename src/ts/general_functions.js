let $ = (selector) => document.querySelector(selector);
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

async function getUser() {
    if (window.location.search !== ''){
        document.getElementById('link').href = window.location.href
    }
    let config = {headers: {'Content-Type' : 'application/json','Authorisation' : 'Bearer 0000000-00000000-0000000'}}
    if(document.cookie.split(document.cookie.split('spotify=')[1] !== undefined)) {
        let r = await axios.post('https://npbe.ramzihijjawi.me/me', {'cookie': `${document.cookie.split('spotify=')[1].split(';')[0]}`}, config)
        if (r.data.hasOwnProperty('error')) {
            document.cookie = "spotify=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
    let m = await axios.post('https://npbe.ramzihijjawi.me/me', {'cookie': `${document.cookie.split('spotify=')[1].split(';')[0]}`})
    let r = await axios.post('https://npbe.ramzihijjawi.me/rooms', {'cookie': `${document.cookie.split('spotify=')[1].split(';')[0]}`, 'username':m.data.display_name})
    document.cookie = r.data.set
    window.open(r.data.redir)
});

async function setTitle() {
    let n = await axios.get(`https://npbe.ramzihijjawi.me/room${document.location.search}`)
    if (n.headers["host"] !== undefined) {
    document.title = `${n.headers["host"]}'s Spotify Room`
    }
}
document.addEventListener('DOMContentLoaded', getUser());

