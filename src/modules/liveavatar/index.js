const Promise = require("bluebird");

const _ = require("lodash");
const config = require("config");
const fs = Promise.promisifyAll(require("fs"));
const Path = require("path");

module.exports = {
	load(k8000, debug) {
		this.lastHour = -1;

		debug("Setting interval");
		this.interval = setInterval(() => {
			debug("Checking hour");
			const hour = (new Date().getHours() + config.get("liveAvatar.offset")) % 24;

			if (this.lastHour < hour) {
				const filename = Path.resolve(k8000.data, "avatars", _.padStart(hour, 2, "0") + ".jpg");
				this.lastHour = hour;

				debug("Reading %s", filename);
				return fs.readFileAsync(filename)
					.then(data => {
						k8000.user.setAvatar(data);
					})
					.then(() => {
						debug("Successfully set avatar!");
					});
			}
		}, 60000);
	},
	unload(k8000, debug) {
		debug("Clearing interval");
		clearInterval(this.interval);
	}
};
