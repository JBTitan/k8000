const config = require("config");

module.exports = {
	load() {
		this.message = -1;
	},
	unload() {
	},
	getPlaying(k8000) {
		let strings = k8000.data.get("modules.playing.strings");
		if (!strings) {
			strings = ["github.com/dnaf/k8000"];
			k8000.data.set("modules.playing.strings", strings);
		}
		this.message = (this.message + 1) % strings.length;
		return strings[this.message];
	}
}
