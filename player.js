const os = require("os")
const exec = require("child_process").exec
const fs = require("fs")
const path = require("path")

const status = document.getElementById("status")
const win = nw.Window.get()

// Create tray icon
const tray = new nw.Tray({
	title: "spotify-qt-player",
	icon: "icon.png"
})

// Add tray menu
const menu = new nw.Menu()
menu.append(new nw.MenuItem({
	type: "normal",
	label: "Show main window",
	click: () => {
		win.show()
		win.focus()
	}
}))
menu.append(new nw.MenuItem({
	type: "normal",
	label: "Quit",
	click: () => {
		nw.App.quit()
	}
}))
tray.menu = menu

// Hide main window
//win.hide()

// Hide when minimizing
win.on("minimize", () => win.hide())

function getAccessToken(callback)
{
	/*
	 * spotify-qt config locations:
	 * linux:	~/.config/kraxarn/spotify-qt.conf
	 * macos:	?
	 * windows:	HKEY_CURRENT_USER\Software\kraxarn\spotify-qt\Spotify
	 */
	
	if (os.platform() === "linux")
	{
		// Read config file
		fs.readFile(path.join(os.homedir(), ".config/kraxarn/spotify-qt.conf"), "utf8", (err, data) => {
			data.split(os.EOL).forEach(row => {
				if (row.startsWith("AccessToken=")) {
					callback(row.substring(row.indexOf("AccessToken=") + 12))
				}
			})
		})
	}
	else if (os.platform() === "windows")
	{
		// Read from registry
		exec("reg query \"HKCU\\Software\\kraxarn\\spotify-qt\"", (error, stdout, stderr) => {
			// Windows new line is always \r\n
			stdout.split("\r\n").forEach(row => {
				if (row.trim().startsWith("AccessToken")) {
					callback(row.substring(row.indexOf("REG_SZ") + 6).trim())
				}
			})
		})
	}
	else
	{
		// Unsupported
		callback(null)
	}
}

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
		getOAuthToken: getAccessToken()
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
	})
	// Connect to the player!
	player.connect()
}