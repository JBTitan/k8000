const Promise = require("bluebird");

const reactionCharacters = {
	// Letters
	A: ["🇦", "🅰"],
	B: ["🇧", "🅱"],
	C: ["🇨"],
	D: ["🇩"],
	E: ["🇪"],
	F: ["🇫"],
	G: ["🇬"],
	H: ["🇭"],
	I: ["🇮"],
	i: ["ℹ️"],
	J: ["🇯"],
	K: ["🇰"],
	L: ["🇱"],
	M: ["🇲", "Ⓜ"],
	N: ["🇳"],
	O: ["🇴", "🅾", "⭕"],
	P: ["🇵", "🅿"],
	Q: ["🇶"],
	R: ["🇷"],
	S: ["🇸"],
	T: ["🇹"],
	U: ["🇺"],
	V: ["🇻"],
	W: ["🇼"],
	X: ["🇽", "✖", "❌", "❎"],
	Y: ["🇾"],
	Z: ["🇿"],

	// Numbers
	100: ["💯"],

	// Punctuation
	"!": ["❗", "❕"],
	"?": ["❓", "❔"],
	"!!": ["‼️"],

	// Symbols
	"#": ["#⃣"],

	// Other (none of the strings are right) i'll fix it later
/*	BACK: ["🔙"],
	END: ["🔚"],
	ON: ["🔛"],
	SOON: ["🔜"],
	TOP: ["🔝"],
	AB: ["🆎"],
	CL: ["🆑"],
	COOL: ["🆒"],
	FREE: ["🆓"],
	ID: ["🆔"],
	NEW: ["🆕"],
	NG: ["🆖"],
	OK: ["🆗"],
	SOS: ["🆘"],
	UP: ["🆙"],
	VS: ["🆚"] */
};

module.exports = {
	load(k8000, debug) {
		this.messageCallback = message => {
			if (message.author !== k8000.user) {
				return;
			}

			const match = message.content.match(/(\d+)\^react ([a-zA-Z0-9!]+)/) || [];
			if (match.length === 3) { // Whole match, id, and reaction text
				debug("Received %s", message.content);

				const messageId = match[1];
				const text = match[2];

				return message.delete().then(() => {
					debug("Deleted message");
					message.channel.fetchMessage(messageId).then(m => {
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
					});
				}).catch(k8000.err);
			}
		};

		k8000.on("message", this.messageCallback);
	},
	unload(k8000, debug) {
		debug("Removing message listener");
		k8000.removeListener("message", this.messageCallback);
	}
};
