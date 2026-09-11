// GENERATED FILE - do not edit by hand.
// Compiled from app.plugin.ts by `bun run build:plugin`.
// Expo loads this file, not the .ts source, so edit app.plugin.ts and rebuild.
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const package_json_1 = __importDefault(require("./package.json"));
const withEntitlementsPlugin = (config, props) => {
    return (0, config_plugins_1.withEntitlementsPlist)(config, (configPlist) => {
        configPlist.modResults['com.apple.developer.healthkit'] = true;
        // background is enabled by default, but possible to opt-out from
        // (haven't seen any drawbacks from having it enabled)
        if (props?.background !== false) {
            configPlist.modResults['com.apple.developer.healthkit.background-delivery'] = true;
        }
        return configPlist;
    });
};
const withInfoPlistPlugin = (config, props) => {
    return (0, config_plugins_1.withInfoPlist)(config, (configPlist) => {
        const existingShareDescription = configPlist.modResults.NSHealthShareUsageDescription;
        configPlist.modResults.NSHealthShareUsageDescription =
            typeof props?.NSHealthShareUsageDescription === 'string'
                ? props.NSHealthShareUsageDescription
                : typeof existingShareDescription === 'string'
                    ? existingShareDescription
                    : `${config.name ?? package_json_1.default.name} wants to read your health data`;
        if (props?.NSHealthUpdateUsageDescription !== false) {
            const existingUpdateDescription = configPlist.modResults.NSHealthUpdateUsageDescription;
            configPlist.modResults.NSHealthUpdateUsageDescription =
                typeof props?.NSHealthUpdateUsageDescription === 'string'
                    ? props.NSHealthUpdateUsageDescription
                    : typeof existingUpdateDescription === 'string'
                        ? existingUpdateDescription
                        : `${config.name ?? package_json_1.default.name} wants to update your health data`;
        }
        return configPlist;
    });
};
const healthkitAppPlugin = (config, props) => {
    return (0, config_plugins_1.withPlugins)(config, [
        [withEntitlementsPlugin, props],
        [withInfoPlistPlugin, props],
    ]);
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(healthkitAppPlugin, package_json_1.default.name, package_json_1.default.version);
