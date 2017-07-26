const Promise = require("bluebird");

const Canvas = require("canvas");
const fs = Promise.promisifyAll(require("fs"));
const Path = require("path");

async function generateCake(text) {
	const canvas = new Canvas(612, 406);
	const ctx = canvas.getContext("2d");

	return fs.readFileAsync(Path.resolve(__dirname, "cake.png")).then(data => {
		const image = new Canvas.Image();
		image.src = data;

		ctx.drawImage(image, 0, 0);

		ctx.save();

		ctx.rotate(-0.055);
		ctx.transform(0.63610, -0.14099, 0.37348, 0.36254, -11.333333, 152);

		ctx.fillStyle = "red";

		ctx.font = "1px sans-serif";
		const {width} = ctx.measureText(text);

		ctx.font = (1100 / width) + "px sans-serif";

		ctx.fillText(text, 20, 200, 2);

		ctx.restore();

		return canvas.toBuffer();
	});
}

module.exports = {
	load() {
	},
	unload() {
	},

	commands: [
		{
			aliases: ["cake"],
			async fn(args, message, k8000, debug) {
				debug("Creating cake with text %s", args);

				const img = await generateCake(args);

				return message.channel.send(undefined, {
					files: [{
						attachment: img,
						name: "cake.png"
					}]});
			}
		}
	]
};
