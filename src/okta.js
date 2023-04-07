const axios = require("axios");
const crypto = require("crypto");
const base64url = require("base64url");
const state = "security_token";
const code_verifier = "s4vqXQA0ePi98eS9Px4jcghBi7UQHRaQl6jMRwLkBj9Eh8g1yxnesereK4jUHdAT0HkLEWBPLZ8z35HX1Ditxf";
const app_domain = process.env.OKTA_APP_DOMAIN;

module.exports = function (app) {
    app.get("/auth/okta", function (req, res) {
        const authorization_url = `${app_domain}/oauth2/default/v1/authorize`;
        const client_id = process.env.OKTA_CLIENT_ID;
        const scope = "openid";
        const response_type = "code";
        const redirect_uri = process.env.OKTA_SIGNIN_REDIRECT_URI;
        const code_challenge_method = "S256";
        const code_challenge = base64url.encode(crypto.createHash("sha256").update(code_verifier).digest());

        res.redirect(`${authorization_url}?client_id=${client_id}&scope=${scope}&response_type=${response_type}&redirect_uri=${redirect_uri}&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}&state=${state}`);
    });

    app.get("/auth/okta/signin-callback", async function (req, res, next) {
        try {
            if (req.query.state !== state) {
                return res.status(401).send("Invalid state parameter.");
            }

            const response = await axios.post(`${app_domain}/oauth2/default/v1/token`, {
                grant_type: "authorization_code",
                code: req.query.code,
                code_verifier: code_verifier,
                client_id: process.env.OKTA_CLIENT_ID,
                redirect_uri: process.env.OKTA_SIGNIN_REDIRECT_URI
            }, {
                headers: {
                    accept: "application/json",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded"
                }
            });

            let query_string = "?provider=okta";
            for (const [key, value] of Object.entries(response.data)) {
                query_string += `&${key}=${value}`;
            }

            res.redirect(`/${query_string}`);
        } catch (err) {
            console.error(err);
            next(err);
        }
    });
};
