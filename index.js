const app = require("./src/express");

if (app.settings.env === "development") {
    const fs = require("fs");
    const https = require("https");

    const key = fs.readFileSync("localhost+2-key.pem", "utf-8");
    const cert = fs.readFileSync("localhost+2.pem", "utf-8");

    https.createServer({ key, cert }, app).listen(app.get("port"), function () {
        console.info(`Server running on port ${app.get("port")} in ${app.settings.env} mode...`);
    });
} else {
    app.listen(app.get("port"), function () {
        console.info(`Server running on port ${app.get("port")} in ${app.settings.env} mode...`);
    });
}

module.exports = app;
