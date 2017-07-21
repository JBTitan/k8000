const config = require("config");

module.exports = {
	load() {
		this.message = -1;
		this.statuses = config.get("playing.statuses");
	},
	unload() {
	},
	getPlaying() {
		this.message++;
		return this.statuses[this.message % this.statuses.length];
	}
}
