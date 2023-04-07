const path = require("path");
const express = require("express");

require("dotenv").config();

const app = express();

app.set("port", process.env.PORT);
app.use(express.static(`${__dirname}/views`));
app.set("views", path.join(process.cwd(), "src/views"));

app.get("/", function (req, res) {
    res.render("index");
});

require("./facebook")(app);
require("./github")(app);
require("./google")(app);
require("./okta")(app);

if (app.settings.env === "development") {
    const fs = require("fs");
    const https = require("https");

    const key = fs.readFileSync("localhost-key.pem", "utf-8");
    const cert = fs.readFileSync("localhost.pem", "utf-8");

    https.createServer({ key, cert }, app).listen(app.get("port"), function () {
        console.info(`Server running on port ${app.get("port")} in ${app.settings.env} mode...`);
    });
} else {
    app.listen(app.get("port"), function () {
        console.info(`Server running on port ${app.get("port")} in ${app.settings.env} mode...`);
    });
}
