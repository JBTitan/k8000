module.exports = {
	load() {
	},
	unload() {
	},
	getPlaying(k8000) {
		const data = k8000.data.get("modules.playing");
		if (!data.strings) {
			data.strings = ["github.com/dnaf/k8000"];
			k8000.data.set("modules.playing.strings", data.strings);
		}
		if (!data.current) {
			data.current = -1;
		}

		data.current = (data.current + 1) % data.strings.length;

		k8000.data.set("modules.playing.current", data.current);
		return data.strings[data.current];
	}
};
