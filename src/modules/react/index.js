const Promise = require("bluebird");

const reactionCharacters = require("./reactioncharacters.js");

module.exports = {
	load() {},
	unload() {},

	commands: [
		{
			aliases: ["react", "rct"],
			async fn(args, message, k8000, debug) {
				let text = args.split(" ");
				const messageId = text.shift();
				text = text.join(" ");

				let m = await message.channel.fetchMessage(messageId);

				debug("Fetched message to react to");
				const emoji = [];
				for (let i = 0; i < text.length; i++) {
					const possibleEmoji = reactionCharacters[text[i].toUpperCase()] || [];

					for (let j = 0; j < possibleEmoji.length; j++) {
						if (emoji.indexOf(possibleEmoji[j]) === -1) {
							emoji.push(possibleEmoji[j]);
							break;
						}
					}
				}

				debug("Matched emoji: %s", emoji.join(" "));

				return Promise.each(emoji, e => {
					return m.react(e);
				}).then(() => {
					debug("Finished");
				});
			}
		}
	]
};
