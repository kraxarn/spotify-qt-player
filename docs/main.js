window.onSpotifyWebPlaybackSDKReady = () => {
	const token = location.href.substring(location.href.lastIndexOf("?token=") + 7)
	const player = new Spotify.Player({
		name: "spotify-qt",
		getOAuthToken: cb => { cb(token) }
	})
	player.connect()
}