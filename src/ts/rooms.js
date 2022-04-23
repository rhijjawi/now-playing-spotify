async function makeroom() {
    let r = await axios.post('https://npbe.ramzihijjawi.me/rooms')
    window.open(r.data)
}