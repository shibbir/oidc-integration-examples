const axios = require("axios");
const crypto = require("crypto");
const state = "security_token";

module.exports = function (app) {
    app.get("/auth/azure-ad", function (req, res) {
        const authorization_url = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize`;
        const client_id = process.env.AZURE_CLIENT_ID;
        const scope = "openid email profile";
        const response_type = "code";
        const redirect_uri = process.env.AZURE_REDIRECT_URI;
        const nonce = crypto.randomBytes(20).toString("hex");

        res.redirect(`${authorization_url}?client_id=${client_id}&scope=${scope}&response_type=${response_type}&redirect_uri=${redirect_uri}&nonce=${nonce}&state=${state}`);
    });

    app.get("/auth/azure-ad/callback", async function (req, res, next) {
        try {
            if (req.query.state !== state) {
                return res.status(401).send("Invalid state parameter.");
            }

            const response = await axios.post(`https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`, {
                grant_type: "authorization_code",
                code: req.query.code,
                client_id: process.env.AZURE_CLIENT_ID,
                client_secret: process.env.AZURE_CLIENT_SECRET,
                redirect_uri: process.env.AZURE_REDIRECT_URI
            }, {
                headers: {
                    accept: "application/json",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded"
                }
            });

            let query_string = "?provider=azure-ad";
            for (const [key, value] of Object.entries(response.data)) {
                query_string += `&${key}=${value}`;
            }

            res.redirect(`/${query_string}`);
        } catch (err) {
            next(err);
        }
    });
};
