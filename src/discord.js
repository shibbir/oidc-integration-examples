const axios = require("axios");

module.exports = function (app) {
    app.get("/auth/discord", function (req, res) {
        const authorization_url = "https://discord.com/api/oauth2/authorize";
        const client_id = process.env.DISCORD_CLIENT_ID;
        const scope = "identify";
        const response_type = "code";
        const redirect_uri = process.env.DISCORD_SIGNIN_REDIRECT_URI;
        const state = "security_token";

        res.redirect(`${authorization_url}?client_id=${client_id}&scope=${scope}&response_type=${response_type}&redirect_uri=${redirect_uri}&state=${state}`);
    });

    app.get("/auth/discord/callback", async function (req, res, next) {
        try {
            if (req.query.state !== "security_token") {
                return res.status(401).send("Invalid state parameter.");
            }

            const response = await axios.post("https://discord.com/api/oauth2/token", {
                grant_type: "authorization_code",
                code: req.query.code,
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                redirect_uri: process.env.DISCORD_SIGNIN_REDIRECT_URI
            }, {
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                }
            });

            let query_string = "?provider=discord";
            for (const [key, value] of Object.entries(response.data)) {
                query_string += `&${key}=${value}`;
            }

            res.redirect(`/${query_string}`);
        } catch (err) {
            next(err);
        }
    });
};
