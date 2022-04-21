import spotipy
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
import requests
import os
import uuid
from flask import Flask, redirect, abort, session, request
from flask_cors import CORS
from flask_session import Session


app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(64)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = './.flask_session/'

c_id = "********************" #Change this
c_sec = "********************" #Change this
callback = "https://localhost/callback" #Change this

CORS(app)
Session(app)
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=c_id,client_secret=c_sec,redirect_uri=callback,scope="user-read-currently-playing  user-read-playback-state", open_browser=False))
caches_folder = './.spotify_caches/'
if not os.path.exists(caches_folder):
    os.makedirs(caches_folder)
sp.current_playback() #Check if lib is working and connected
@app.route("/", methods=["GET"])
def m():
    curr = sp.current_playback()
    if curr == None:
        return {"status":"not_playing"}
    else:
        return curr

@app.route('/login')
def login():
    if not session.get('uuid'):
        # Step 1. Visitor is unknown, give random ID
        session['uuid'] = str(uuid.uuid4())
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=f'./.spotify_caches/{session.get("uuid")}')
    auth_manager = spotipy.oauth2.SpotifyOAuth(client_id=c_id, client_secret=c_sec,redirect_uri=callback,scope='user-read-currently-playing user-modify-playback-state playlist-modify-private',
                                                cache_handler=cache_handler, 
                                                show_dialog=True)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        # Step 2. Display sign in link when no token
        auth_url = auth_manager.get_authorize_url()
        return redirect(auth_url)
    else:
        return session.get("uuid")

@app.route('/callback')
def callback():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=f'./.spotify_caches/{session.get("uuid")}')
    auth_manager = spotipy.oauth2.SpotifyOAuth(client_id=c_id, client_secret=c_sec,redirect_uri=callback,scope='user-read-currently-playing user-modify-playback-state playlist-modify-private',cache_handler=cache_handler, show_dialog=True)
    if request.args.get("code"):
        # Step 3. Being redirected from Spotify auth page
        auth_manager.get_access_token(request.args.get("code"))
        return session.get("uuid")

@app.route('/song', methods=["PUT"])
def play_song():
    session = request.json['session']
    print(session)
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=f'./.spotify_caches/{session}')
    auth_manager = spotipy.oauth2.SpotifyOAuth(client_id=c_id, client_secret=c_sec,redirect_uri=callback,scope='user-read-currently-playing user-modify-playback-state playlist-modify-private',cache_handler=cache_handler,show_dialog=True)
    curr_song = request.json['uris']
    s = requests.put('https://api.spotify.com/v1/me/player/play', headers={"Authorization":"Bearer {0}".format(auth_manager.validate_token(cache_handler.get_cached_token())['access_token']), 'Content-Type':"application/json"}, json={"uris": curr_song, "offset": {"position": request.json['offset']['position']},"position_ms": request.json['position_ms']})
    return f"{s.text}"

@app.route('/pause', methods=["PUT"])
def pause_song():
    session = request.json['session']
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=f'./.spotify_caches/{session}')
    auth_manager = spotipy.oauth2.SpotifyOAuth(client_id=c_id, client_secret=c_sec,redirect_uri=callback,scope='user-read-currently-playing user-modify-playback-state playlist-modify-private',cache_handler=cache_handler,show_dialog=True)
    curr_song = request.json['uris']
    s = requests.put('https://api.spotify.com/v1/me/player/pause', headers={"Authorization":"Bearer {0}".format(auth_manager.validate_token(cache_handler.get_cached_token())['access_token']), 'Content-Type':"application/json"}, json={"uris": curr_song,"offset": {"position": request.json['offset']['position']},"position_ms": request.json['position_ms']})
    return f"{s.text}"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
