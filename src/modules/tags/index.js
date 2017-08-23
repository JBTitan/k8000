module.exports = {
	load() {},
	unload() {},

	commands: [
		{
			aliases: ["tag", "tags", "t"],
			async fn(args, message, k8000, debug) {
				args = args.trim().split(" ");
				const tag = args.shift().trim().toLowerCase();
				args = args.join(" ").trim();

				if (!tag) { // List tags
					return message.reply("**Tags**\n`" + Object.keys(k8000.data.get("modules.tags")).join("`, `") + "`");
				} else if (args.length === 0) { // Return tag
					const tagData = k8000.data.get("modules.tags", tag);

					return message.reply(tagData);
				}  // Set tag
				k8000.data.set("modules.tags", tag, args);

				return message.reply("Set tag");
			}
		}
	]
};
