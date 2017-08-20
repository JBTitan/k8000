const Promise = require("bluebird");

const fs = Promise.promisifyAll(require("fs"));

module.exports = {
	load() {},
	unload() {},

	commands: [
		{
			aliases: ["voidorg"],
			async fn(args, message, k8000, debug) {
				let icon = fs.readFileAsync("/home/dnaf/Downloads/discord-blank.png");
				let guilds = k8000.guilds.filter((guild) => {
					return (guild.name === "/ /" || guild.name === "―――" || guild.name === "void");
				}).array();

				return Promise.each(guilds, async (guild) => {
					debug("Setting name for guild " + guild);
					await guild.setName("void");
					debug("Setting icon for guild " + guild);
					await guild.setIcon(await icon);
				});
			}
		}
	]
};
