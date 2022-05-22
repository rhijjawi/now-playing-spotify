let $ = (selector) => document.querySelector(selector);
var socket = io('https://npbe.ramzihijjawi.me');

function rmEventListener(func) {
    document.getElementById('prep_btn').removeEventListener('click', func)
}

function listenAlong() {
    return $('#la_toggle').checked
}

function getAuth(cookie) {
    for (i of document.cookie.split('; ')) {
        if (i.startsWith(cookie)) {
            return i.split('=')[1]
        }
    }
    return false
}

async function getUser() {
    if (window.location.search !== ''){
        document.getElementById('link').href = window.location.href
    }
    let config = {headers: {'Content-Type' : 'application/json','Authorisation' : 'Bearer 0000000-00000000-0000000'}}
    if(getAuth('spotify') !== false) {
        let r = await axios.post('https://npbe.ramzihijjawi.me/me', {'cookie': `${getAuth('spotify')}`}, config)
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
    else {
        document.getElementById('prep_btn').hidden = false;
        $('#prep_btn').addEventListener('click', async function login() {
            window.open('https://npbe.ramzihijjawi.me/login', '_self')
        })
    }
}

document.getElementById('makeroom').addEventListener('click', async function makeroom() {
    if (getAuth('spotify') !== false){
        let m = await axios.post('https://npbe.ramzihijjawi.me/me', {'cookie': `${getAuth('spotify')}`})
        socket.emit('make_room', {'cookie': `${getAuth('spotify')}`, 'username':m.data.display_name})
        socket.on('room_created', (data) => {
            document.cookie = data.set
            window.open(data.redir)
        });
    }
    else {
        window.open('https://npbe.ramzihijjawi.me/login', '_self')
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
            if (i.split('=')[1] == 'true'){
                $('#la_toggle').checked = true
            }
            else {
                $('#la_toggle').checked = false
            }
        }

    }
});
document.addEventListener('DOMContentLoaded', getUser());
document.addEventListener('DOMContentLoaded', async () => {
    await setTitle()
})