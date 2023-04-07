const axios = require("axios");
const crypto = require("crypto");
const base64url = require("base64url");
const state = "security_token";
const code_verifier = "s4vqXQA0ePi98eS9Px4jcghBi7UQHRaQl6jMRwLkBj9Eh8g1yxnesereK4jUHdAT0HkLEWBPLZ8z35HX1Ditxf";

module.exports = function (app) {
    app.get("/auth/facebook", function (req, res) {
        const authorization_url = "https://www.facebook.com/dialog/oauth";
        const client_id = process.env.FACEBOOK_CLIENT_ID;
        const scope = "openid";
        const response_type = "code";
        const redirect_uri = process.env.FACEBOOK_AUTHORIZED_REDIRECT_URI;
        const code_challenge_method = "S256";
        const nonce = crypto.randomBytes(20).toString("hex");
        const code_challenge = base64url.encode(crypto.createHash("sha256").update(code_verifier).digest());

        res.redirect(`${authorization_url}?client_id=${client_id}&scope=${scope}&response_type=${response_type}&redirect_uri=${redirect_uri}&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}&nonce=${nonce}&state=${state}`);
    });

    app.get("/auth/facebook/callback", async function (req, res, next) {
        try {
            if (req.query.state !== state) {
                return res.status(401).send("Invalid state parameter.");
            }

            const response = await axios.get("https://graph.facebook.com/oauth/access_token", {
                params: {
                    client_id: process.env.FACEBOOK_CLIENT_ID,
                    redirect_uri: process.env.FACEBOOK_AUTHORIZED_REDIRECT_URI,
                    code_verifier: code_verifier,
                    code: req.query.code
                }
            });

            let query_string = "?provider=facebook";
            for (const [key, value] of Object.entries(response.data)) {
                query_string += `&${key}=${value}`;
            }

            res.redirect(`/${query_string}`);
        } catch (err) {
            next(err);
        }
    });
};
