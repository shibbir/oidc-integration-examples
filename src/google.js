const axios = require("axios");
const crypto = require("crypto");

module.exports = function (app) {
    app.get("/auth/google", function (req, res) {
        const authorization_endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
        const client_id = process.env.GOOGLE_CLIENT_ID;
        const response_type = "code";
        const scope = "openid email";
        const redirect_uri = process.env.GOOGLE_AUTHORIZED_REDIRECT_URI;
        const nonce = crypto.randomBytes(20).toString("hex");
        const state = "security_token";

        res.redirect(`${authorization_endpoint}?client_id=${client_id}&response_type=${response_type}&scope=${scope}&redirect_uri=${redirect_uri}&nonce=${nonce}&state=${state}`);
    });

    app.get("/auth/google/callback", async function (req, res, next) {
        try {
            if (req.query.state !== "security_token") {
                return res.status(401).send("Invalid state parameter.");
            }

            const response = await axios.post("https://oauth2.googleapis.com/token", {
                code: req.query.code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
                grant_type: "authorization_code"
            });

            let query_string = "?provider=google";
            for (const [key, value] of Object.entries(response.data)) {
                query_string += `&${key}=${value}`;
            }

            res.redirect(`/${query_string}`);
        } catch (err) {
            next(err);
        }
    });
};
