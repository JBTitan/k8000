const config = require("config");
const K8000 = require("./k8000");

const k8000 = new K8000("/home/dnaf/Projects/k8000/data/");

k8000.login(config.get("discord.token"));

