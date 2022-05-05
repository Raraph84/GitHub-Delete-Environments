const { default: fetch } = require("node-fetch");
const Config = require("./config.json");

(async () => {

    let repos;
    try {
        repos = await fetch("https://api.github.com/user/repos?per_page=100", { headers: { Authorization: "token " + Config.token } });
        repos = await repos.json();
    } catch (error) {
        console.log(error);
        return;
    }

    repos.forEach(async (repo) => {

        let deployments;
        try {
            deployments = await fetch("https://api.github.com/repos/" + repo.full_name + "/deployments?per_page=100", { headers: { Authorization: "token " + Config.token } });
            deployments = await deployments.json();
        } catch (error) {
            console.log(error);
            return;
        }

        if (deployments.length === 0) return;

        console.log(repo.full_name + " : " + deployments.length + ", deleting...");

        deployments.forEach(async (deployment) => {

            try {
                await fetch("https://api.github.com/repos/" + repo.full_name + "/deployments/" + deployment.id, { method: "DELETE", headers: { Authorization: "token " + Config.token } });
            } catch (error) {
                console.log(error);
            }

            console.log("Deleted " + repo.full_name + "/" + deployment.id);
        });
    });

})();