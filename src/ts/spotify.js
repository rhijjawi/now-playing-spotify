document.getElementById('makeroom').addEventListener('click', async function() {
    let r = await axios.post('https://npbe.ramzihijjawi.me/rooms', {withCredentials: true})
    document.cookie = r.data.set
    window.open(r.data.redir)
});
