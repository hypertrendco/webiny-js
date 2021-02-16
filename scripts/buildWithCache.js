#!/usr/bin/env node
const { getPackages } = require("./utils/getPackages");
const { hashElement } = require("folder-hash");
const fs = require("fs-extra");
const execa = require("execa");
const path = require("path");
const loadJson = require("load-json-file");
const writeJson = require("write-json-file");
const { green } = require("chalk");

const CACHE_FOLDER_PATH = ".webiny/cached-packages";
const META_FILE_PATH = path.join(CACHE_FOLDER_PATH, "meta.json");

(async () => {
    const start = new Date();
    await build();
    const duration = (new Date() - start) / 1000;
    console.log();
    console.log(`Done! Build finished in ${green(duration + "s")}.`);
})();

async function build() {
    // Only do caching of TS packages.
    const workspacesPackages = getPackages({ includes: "/packages/" }).filter(item => item.isTs);

    let metaJson = { packages: {} };
    try {
        metaJson = loadJson.sync(META_FILE_PATH);
    } catch {}

    const packagesNoCache = [];
    const packagesUseCache = [];

    // 1. Determine for which packages we can use the cached built code, and for which we need to execute build.
    for (let i = 0; i < workspacesPackages.length; i++) {
        const workspacePackage = workspacesPackages[i];

        const cacheFolderPath = getPackageCacheFolderPath(workspacePackage);
        if (!fs.existsSync(cacheFolderPath)) {
            packagesNoCache.push(workspacePackage);
            continue;
        }

        const sourceHash = await getPackageSourceHash(workspacePackage);

        const packageMeta = metaJson.packages[workspacePackage.packageJson.name] || {};
        console.log("testing", workspacesPackages.packageJson.name);

        console.log('packageMeta.sourceHash', packageMeta.sourceHash)
        console.log('sourceHash', sourceHash)

        if (packageMeta.sourceHash === sourceHash) {
            packagesUseCache.push(workspacePackage);
        } else {
            packagesNoCache.push(workspacePackage);
        }
    }

    // 2. Let's use cached built code where possible.
    if (packagesUseCache.length) {
        if (packagesUseCache.length > 10) {
            console.log(`Using cache for ${green(packagesUseCache.length)} packages.`);
        } else {
            console.log("Using cache for following packages:");
            for (let i = 0; i < packagesUseCache.length; i++) {
                const item = packagesUseCache[i];
                console.log(green(item.packageJson.name));
            }
        }

        for (let i = 0; i < packagesUseCache.length; i++) {
            const workspacePackage = packagesUseCache[i];
            const cacheFolderPath = path.join(CACHE_FOLDER_PATH, workspacePackage.packageJson.name);
            fs.copySync(cacheFolderPath, path.join(workspacePackage.packageFolder, "dist"));
        }
    } else {
        console.log("Cache is empty, all packages need to be built.");
    }

    // 3. Where needed, let's build and update the cache.
    if (packagesNoCache.length === 0) {
        console.log("There are no packages that need to be built.");
        return;
    }

    if (packagesNoCache.length > 10) {
        console.log(`Running build for ${green(packagesNoCache.length)} packages.`);
    } else {
        console.log("Running build for following packages:");
        for (let i = 0; i < packagesNoCache.length; i++) {
            const item = packagesNoCache[i];
            console.log(green(item.packageJson.name));
        }
    }

    buildPackages(packagesNoCache);

    console.log("Packages built, updating cache...");
    for (let i = 0; i < packagesNoCache.length; i++) {
        const workspacePackage = packagesNoCache[i];
        const cacheFolderPath = path.join(CACHE_FOLDER_PATH, workspacePackage.packageJson.name);
        fs.copySync(path.join(workspacePackage.packageFolder, "dist"), cacheFolderPath);

        const sourceHash = await getPackageSourceHash(workspacePackage);
        metaJson.packages[workspacePackage.packageJson.name] = { sourceHash };
    }

    writeJson.sync(META_FILE_PATH, metaJson);
}

// Utility functions.
function getPackageCacheFolderPath(workspacePackage) {
    return path.join(CACHE_FOLDER_PATH, workspacePackage.packageJson.name);
}

async function getPackageSourceHash(workspacePackage) {
    const { hash } = await hashElement(workspacePackage.packageFolder, {
        folders: { exclude: ["dist"] }
    });

    return hash;
}

function buildPackages(workspacePackages) {
    execa.sync(
        "yarn",
        [
            "lerna",
            "run",
            "build",
            "--stream",
            ...workspacePackages.reduce((current, item) => {
                current.push("--scope", item.packageJson.name);
                return current;
            }, [])
        ],
        {
            stdio: "inherit"
        }
    );
}
