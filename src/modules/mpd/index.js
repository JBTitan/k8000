const Promise = require("bluebird");

const config = require("config");
const mpd = require("mpd");

module.exports = {
	load(k8000, debug) {
		debug("Connecting to MPD server");
		this.client = Promise.promisifyAll(mpd.connect({
			host: config.get("mpd.host"),
			port: config.get("mpd.port")
		}));

		this.client.on("system-player", () => {
			debug("Received player event; querying status");
			return this.client.sendCommandAsync("status")
				.then(mpd.parseKeyValueMessage)
				.then(msg => {
					debug("Player state is \"%s\"", msg.state);
					if (msg.state === "play") {
						return this.client.sendCommandAsync("currentsong")
							.then(mpd.parseKeyValueMessage)
							.then(song => {
								const playing = (song.Artist || "Unknown") + " - " + (song.Title || "Unknown");
								debug("Setting playing message to %s", playing);
								return k8000.user.setGame(playing);
							});
					}
					debug("Clearing playing message");
					k8000.user.setGame();
				}).catch(k8000.err);
		});
	},
	unload(k8000, debug) {
		debug("Closing client");
		return this.client.sendCommandAsync("close");
	}
};
