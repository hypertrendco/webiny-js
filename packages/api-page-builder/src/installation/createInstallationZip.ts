import path from "path";
/**
 * Package zip-local does not have types.
 */
// @ts-ignore
import zipper from "zip-local";
import fs from "fs";

export default (destination: string = "./pageBuilderInstallation.zip") => {
    if (fs.existsSync(destination)) {
        return;
    }

    const dir = path.dirname(destination);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return zipper.sync.zip(path.join(__dirname, "files")).compress().save(destination);
};
