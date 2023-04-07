const axios = require("axios");

module.exports = function (app) {
    app.get("/auth/github", function (req, res) {
        const authorization_endpoint = "https://github.com/login/oauth/authorize";
        const client_id = process.env.GITHUB_CLIENT_ID;
        const scope = "user:email";
        const redirect_uri = process.env.GITHUB_SIGNIN_REDIRECT_URI;
        const anti_forgery_token = "security_token";

        res.redirect(`${authorization_endpoint}?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${anti_forgery_token}`);
    });

    app.get("/auth/github/callback", async function (req, res, next) {
        try {
            if (req.query.state !== "security_token") {
                return res.status(401).send("Invalid state parameter.");
            }

            const response = await axios.post("https://github.com/login/oauth/access_token", {
                code: req.query.code,
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                redirect_uri: process.env.GITHUB_SIGNIN_REDIRECT_URI
            }, {
                headers: {
                    accept: "application/json"
                }
            });

            let query_string = "?provider=github";
            for (const [key, value] of Object.entries(response.data)) {
                query_string += `&${key}=${value}`;
            }

            res.redirect(`/${query_string}`);
        } catch (err) {
            next(err);
        }
    });
};
