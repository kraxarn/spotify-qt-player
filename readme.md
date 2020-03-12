# spotify-qt-player
Spotify playback client using the [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk). As it is web based, currently it relies on [NW.js](https://nwjs.io/). Meant to be used with [spotify-qt](https://github.com/kraxarn/spotify-qt) as it doesn't have a playback device, but should work with anything.

The docs/ folder contains the old version you can use directly in your browser. It has a lot of issues and is not recommended to use, it's just kept there for now. The folder is called docs/ only because of GitHub Pages limitations.

# Notes
This repo is currently only used to experiment with the web playback sdk. The current nw.js implementation doesn't work very well due to the limited widevine support in nw.js required by the playback sdk (maybe shaka-player could be useful?).