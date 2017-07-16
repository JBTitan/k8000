module.exports = {
	x: 5,
	load(k8000, debug) {
		k8000.on("message", (message) => {
			if (message.content == "^reload") {
				return k8000.unload();
			}
		});
	},
	unload(k8000, debug) {
	}
};
