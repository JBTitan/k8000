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

		/* This.client.on("system-player", () => {
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
		}); */

		this.client.on("ready", () => {
			debug("Client is ready");
			this.ready = true;
		});
	},
	unload(k8000, debug) {
		debug("Closing client");
		this.ready = false;
		return this.client.sendCommandAsync("close");
	},
	getPlaying(k8000, debug) {
		if (this.ready) {
			debug("Checking MPD status");
			return this.client.sendCommandAsync("status")
				.then(mpd.parseKeyValueMessage)
				.then(msg => {
					debug("Player state is \"%s\"", msg.state);
					if (msg.state === "play") {
						return this.client.sendCommandAsync("currentsong")
							.then(mpd.parseKeyValueMessage)
							.then(song => {
								const playing = (song.Artist || "Unknown") + " - " + (song.Title || "Unknown");
								debug("Returning %s", playing);
								return playing;
							});
					}
				}).catch(k8000.err);
		}
	}
};
