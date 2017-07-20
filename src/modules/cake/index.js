const Promise = require("bluebird");

const Canvas = require("canvas");
const fs = Promise.promisifyAll(require("fs"));

function generateCake(text) {
	const canvas = new Canvas(612, 406);
	const ctx = canvas.getContext("2d");

	return fs.readFileAsync(__dirname + "/cake.png").then((data) => {
		const image = new Canvas.Image();
		image.src = data;
		
		ctx.drawImage(image, 0, 0);
	
		ctx.save();
	
		// 406x406
		ctx.rotate(-0.055);
		ctx.transform(0.63610, -0.14099, 0.37348, 0.36254, -11.333333, 152);
		//ctx.fillRect(0, 0, 650, 406);
		
		ctx.fillStyle = "red";
	
		ctx.font = "1px sans-serif";
		let {width} = ctx.measureText(text);
	
		ctx.font = 1100 / width + "px sans-serif";
		
		ctx.fillText(text, 20, 200, 2);
	
		ctx.restore();
	
		return canvas.toBuffer();
	});
}

module.exports = {
	load(k8000, debug) {
		this.messageCallback = message => {
			if (message.author !== k8000.user) {
				return;
			}

			const match = message.content.match(/(.+)\^cake/);
			if (match) {
				debug("Received %s", message.content);
				debug("Deleting message");
				return message.delete().then(() => {
					debug("Creating cake with text %s", match[1]);
					return generateCake(match[1])
				}).then((img) => {
					return message.channel.send(undefined, {
						files: [{
							attachment: img,
							name: "cake.png"
						}]
					});
				}).catch(k8000.err);
			}
		};
		k8000.on("message", this.messageCallback);
	},

	unload(k8000,debug) {
		debug("Removing message callback");
		k8000.removeListener(this.messageCallback);
	}
};
