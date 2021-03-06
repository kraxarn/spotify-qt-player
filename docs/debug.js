const status = document.getElementById("status")

function setStatus(message) {
	status.textContent += `\n${message}`
	window.scrollTo(0, document.body.scrollHeight)
}

window.onSpotifyWebPlaybackSDKReady = () => {
	setStatus("api ready")
	const token = location.href.substring(location.href.lastIndexOf("?token=") + 7)
	setStatus(`using token: ${token}`)
	const player = new Spotify.Player({
		name: "spotify-qt",
		getOAuthToken: cb => { cb(token) }
	})
	// Error handling
	player.addListener('initialization_error', (message) => setStatus(`initialization_error: ${message.message}`))
	player.addListener('authentication_error', (message) => setStatus(`authentication_error: ${message.message}`))
	player.addListener('account_error', (message) => setStatus(`account_error: ${message.message}`))
	player.addListener('playback_error', (message) => setStatus(`playback_error: ${message.message}`))
	// Playback status updates
	player.addListener('player_state_changed', (state) => setStatus(`player_state_changed: ${JSON.stringify(state)}`))
	// Ready
	player.addListener("ready", (device_id) => {
		setStatus("ready")
	})
	// Not Ready
	player.addListener('not_ready', ({ device_id }) => {
		setStatus("offline")
	});
	// Connect to the player!
	player.connect()
}