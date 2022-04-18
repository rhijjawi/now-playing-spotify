let session_token;
let spotify = false;
const _ = setInterval(async function() {
let text = document.getElementById('session')
let session_token = text.value
if (session_token == '') {
  console.log("Spotify not initialised")
}
else {let spotify = true}
if (spotify == true) {
  let text = document.getElementById('session')
  let session_token = text.value
  let config = {
    headers: {
        Authorization: `Bearer ${session_token}`,
        'Content-Type' : 'application/json'
    }
  }
  let data = {"context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr","offset": {"position": 5},"position_ms": 0}
  await axios.put('https://npbe.ramzihijjawi.me/song', data, config)
}
else {}
}, 1000)
