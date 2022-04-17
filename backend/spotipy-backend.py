import spotipy
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth

from flask import Flask, abort 
import flask_cors

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id="************",client_secret="************",redirect_uri="************",scope="user-read-currently-playing  user-read-playback-state"))

app = Flask(__name__)
flask_cors.CORS(app)

@app.route("/np", methods=["GET"])
def m():
    return sp.current_playback()

@app.route('/callback')
def callback():
    pass

if __name__ == "__main__":
    app.run()
