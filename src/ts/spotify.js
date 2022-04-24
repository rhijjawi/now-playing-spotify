document.getElementById('makeroom').addEventListener('click', async function() {
    let r = await axios.post('https://npbe.ramzihijjawi.me/rooms', {withCredentials: true})
    document.cookie = r.data.set
    window.open(r.data.redir)
}); //Room creator function on button click

document.addEventListener("DOMContentLoaded", function(event) { //Submit on Enter
    let text = document.getElementById('session')
    text.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    let session_token = text.value
    document.cookie = `spotify=${session_token}`
    console.log(session_token)
    text.hidden = true
}})
});

function prep() {
    let text = document.getElementById('session')
    text.hidden = false
    window.open('https://npbe.ramzihijjawi.me/login', '_blank')
}; //Log in into Spotify

async function pause(uri) {
    if (spotify == true) {
        if (stillPaused == false) {
        let data = {"session": `${session_token}`, "uri":uri}
        await axios.put('https://npbe.ramzihijjawi.me/pause', data, config)
        stillPaused = true;
    }}}
      