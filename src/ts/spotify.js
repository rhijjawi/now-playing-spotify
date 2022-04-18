let session_token;
let spotify = false;
const _ = setInterval(async function() {
if (session_token == undefined) {
  console.log("Spotify not initialised")
}
else {let spotify = true}
}, 1000)
                      
const i = setInterval(async function() {
if (spotify == true) {
  let config = {
    headers: {
        Authorization: `Bearer ${session_token}`,
        'Content-Type' : 'application/json'
    }
  }
  let data = {"context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr","offset": {"position": 5},"position_ms": 0}
  axios.put('https://npbe.ramzihijjawi.me/song', data, config)
}
else {}
}, 1000)
