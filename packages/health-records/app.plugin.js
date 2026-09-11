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
const HEALTH_RECORDS_ACCESS = 'health-records';
const withEntitlementsPlugin = (config, props) => {
    return (0, config_plugins_1.withEntitlementsPlist)(config, (configPlist) => {
        configPlist.modResults['com.apple.developer.healthkit'] = true;
        const existingAccess = configPlist.modResults['com.apple.developer.healthkit.access'];
        const access = Array.isArray(existingAccess) ? [...existingAccess] : [];
        if (!access.includes(HEALTH_RECORDS_ACCESS)) {
            access.push(HEALTH_RECORDS_ACCESS);
        }
        configPlist.modResults['com.apple.developer.healthkit.access'] = access;
        if (props?.background !== false) {
            configPlist.modResults['com.apple.developer.healthkit.background-delivery'] = true;
        }
        return configPlist;
    });
};
const withInfoPlistPlugin = (config, props) => {
    return (0, config_plugins_1.withInfoPlist)(config, (configPlist) => {
        const existingClinicalDescription = configPlist.modResults.NSHealthClinicalHealthRecordsShareUsageDescription;
        configPlist.modResults.NSHealthClinicalHealthRecordsShareUsageDescription =
            typeof props?.NSHealthClinicalHealthRecordsShareUsageDescription ===
                'string'
                ? props.NSHealthClinicalHealthRecordsShareUsageDescription
                : typeof existingClinicalDescription === 'string'
                    ? existingClinicalDescription
                    : `${config.name ?? package_json_1.default.name} wants to read your clinical health records`;
        const existingShareDescription = configPlist.modResults.NSHealthShareUsageDescription;
        configPlist.modResults.NSHealthShareUsageDescription =
            typeof props?.NSHealthShareUsageDescription === 'string'
                ? props.NSHealthShareUsageDescription
                : typeof existingShareDescription === 'string'
                    ? existingShareDescription
                    : `${config.name ?? package_json_1.default.name} wants to read your health data`;
        return configPlist;
    });
};
const healthRecordsAppPlugin = (config, props) => {
    return (0, config_plugins_1.withPlugins)(config, [
        [withEntitlementsPlugin, props],
        [withInfoPlistPlugin, props],
    ]);
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(healthRecordsAppPlugin, package_json_1.default.name, package_json_1.default.version);
