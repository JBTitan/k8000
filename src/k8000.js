const Promise = require("bluebird");

const debug = require("debug")("k8000");
const discord = require("discord.js");
const fs = Promise.promisifyAll(require("fs"));
const Path = require("path");
const Sequelize = require("sequelize");

/**
 * An instance of a d.naf selfbot.
 */
class K8000 extends discord.Client {
	/**
	 * Creates a d.naf selfbot instance. Note that this does not log the bot in.
	 * @param {string} dataPath A directory to store data in. Please avoid using two bots in the same data path.
	 */
	constructor(dataPath) {
		super();

		this.data = dataPath;
		this.sequelize = new Sequelize("k8000", "k8000", "", {
			host: "localhost",
			dialect: "sqlite",
			storage: "./data/k8000.db"
		});

		this.modules = {};

		this.sequelize.authenticate().then(() => {
			debug("Connected to database");
		}).then(() => {
			this.on("ready", () => {
				debug("Bot logged in to account %s", this.user);
				return fs.readdirAsync(Path.resolve(__dirname, "modules")).each(name => {
					this.loadModule(name);
				}).catch(this.err);
			});
		});
	}

	/**
	 * Handles errors.
	 * @param {Error} err
	 */
	err(err) {
		console.error(err);
		
		return this.channels.get(config.get("errorChannel")).send(err);
	}

	/**
	 * Loads the given module
	 * @param {string} name The name of the module to load.
	 */
	loadModule(name) {
		Promise.try(() => {
			if (this.modules[name]) {
				return;
			}
			debug("Loading module %s", name);
			this.modules[name] = require(Path.resolve(__dirname, "modules", name));
			return this.modules[name].load(this, require("debug")("k8000:modules:" + name));
		}).then(() => {
			return this.modules[name];
		});
	}

	/**
	 * Unloads the given module
	 * @param {string} name The name of the module to unload.
	 */
	unloadModule(name) {
		Promise.try(() => {
			debug("ack2");
			if (!this.modules[name]) {
				return;
			}
			debug("Unloading module %s", name);
			return this.modules[name].unload(this, require("debug")("k8000:modules:" + name));
		}).then(() => {
			return delete this.modules[name];
		});
	}

	/**
	 * Safely unloads the bot and all of its modules.
	 */
	unload() {
		debug("Unloading");
		const fns = Object.keys(this.modules).map(name => {
			return () => {
				return this.unloadModule(name);
			};
		});
.catch(this.err)
		return Promise.all(fns);
	}
}

module.exports = K8000;
