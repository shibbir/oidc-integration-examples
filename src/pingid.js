const axios = require("axios");
const crypto = require("crypto");
const base64url = require("base64url");
const state = "security_token";
const code_verifier = "s4vqXQA0ePi98eS9Px4jcghBi7UQHRaQl6jMRwLkBj9Eh8g1yxnesereK4jUHdAT0HkLEWBPLZ8z35HX1Ditxf";

module.exports = function (app) {
    app.get("/auth/pingid", function (req, res) {
        const authorization_url = process.env.PINGID_AUTHORIZATION_URL;
        const client_id = process.env.PINGID_CLIENT_ID;
        const scope = "openid";
        const response_type = "code";
        const redirect_uri = process.env.PINGID_SIGNIN_REDIRECT_URI;
        const code_challenge_method = "S256";
        const code_challenge = base64url.encode(crypto.createHash("sha256").update(code_verifier).digest());

        res.redirect(`${authorization_url}?client_id=${client_id}&scope=${scope}&response_type=${response_type}&redirect_uri=${redirect_uri}&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}&state=${state}&prompt=login`);
    });

    app.get("/auth/pingid/callback", async function (req, res, next) {
        try {
            if (req.query.state !== state) {
                return res.status(401).send("Invalid state parameter.");
            }

            const response = await axios.post(process.env.PINGID_TOKEN_ENDPOINT, {
                grant_type: "authorization_code",
                code: req.query.code,
                code_verifier: code_verifier,
                client_id: process.env.PINGID_CLIENT_ID,
                client_secret: process.env.PINGID_CLIENT_SECRET,
                redirect_uri: process.env.PINGID_SIGNIN_REDIRECT_URI
            }, {
                headers: {
                    accept: "application/json",
                    "content-type": "application/x-www-form-urlencoded"
                }
            });

            let query_string = "?provider=pingid";
            for (const [key, value] of Object.entries(response.data)) {
                query_string += `&${key}=${value}`;
            }

            res.redirect(`/${query_string}`);
        } catch (err) {
            next(err);
        }
    });
};
