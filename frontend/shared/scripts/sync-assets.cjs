const {
    statSync,
    mkdirSync,
    existsSync,
    readdirSync,
    copyFileSync,
    readFileSync,
} = require("node:fs");
const { dirname, join, relative, resolve } = require("node:path");

const frontendRoot = resolve(__dirname, "..", "..");
const sourceRoot = resolve(__dirname, "..", "assets");

const destinations = {
    dashboard: resolve(frontendRoot, "dashboard", "public"),
    web: resolve(frontendRoot, "web", "public"),
    mobile: resolve(frontendRoot, "mobile", "assets"),
};

// Paths come from the script's location, so it also works from individual workspaces.
function collectFiles(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        // Exclude filesystem metadata such as .DS_Store and hidden directories.
        if (entry.name.startsWith(".")) return [];

        const entryPath = join(directory, entry.name);
        if (entry.isDirectory()) return collectFiles(entryPath);
        if (entry.isFile()) return [entryPath];

        throw new Error(
            `Unsupported shared asset: ${entryPath}. Use regular files and directories.`,
        );
    });
}

function main() {
    const requestedTargets = process.argv.slice(2);
    const targets = requestedTargets.length
        ? [...new Set(requestedTargets)]
        : Object.keys(destinations);

    // Validate every target before copying anything.
    for (const target of targets) {
        if (!Object.hasOwn(destinations, target)) {
            throw new Error(
                `Unknown target "${target}". Choose dashboard, web or mobile, or omit targets to copy to all.`,
            );
        }
    }

    if (!existsSync(sourceRoot) || !statSync(sourceRoot).isDirectory()) {
        throw new Error(`Shared assets directory not found: ${sourceRoot}`);
    }

    const files = collectFiles(sourceRoot);

    for (const target of targets) {
        let copied = 0;
        let unchanged = 0;

        for (const source of files) {
            const destination = join(
                destinations[target],
                relative(sourceRoot, source),
            );

            // Avoid unnecessary writes and development-server reloads on repeated runs.
            if (
                existsSync(destination) &&
                readFileSync(source).equals(readFileSync(destination))
            ) {
                unchanged++;
                continue;
            }

            mkdirSync(dirname(destination), { recursive: true });
            copyFileSync(source, destination);
            copied++;
        }

        // Merge shared assets into each app; never delete app-specific files.
        console.log(
            `[sync:assets] ${target}: ${copied} copied, ${unchanged} unchanged -> ${destinations[target]}`,
        );
    }
}

try {
    main();
} catch (error) {
    console.error(`[sync:assets] ${error.message}`);
    process.exitCode = 1;
}
