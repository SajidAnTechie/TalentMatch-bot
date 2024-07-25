const app = require("./app");

try {
    require("./commands/index");
    require("./actions/index");
    require("./views/index");
} catch (err) {
    console.error("Error loading modules:", err);
    process.exit(1);
}

(async () => {
    // Start your app
    const port = process.env.PORT || 3000;
    await app.start(port);

    console.log(`⚡️ Bolt app is running at port ${port}`);
})();
