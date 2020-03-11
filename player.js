const os = require("os")
const exec = require("child_process").exec;
const fs = require("fs")
const path = require("path")

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
		exec("wine reg query \"HKCU\\Software\\kraxarn\\spotify-qt\"", (error, stdout, stderr) => {
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