const fs = require('node:fs/promises')
const path = require('node:path')
const { withDangerousMod } = require('expo/config-plugins')

// Xcode 27 refuses to build any target whose deployment target is below iOS 15. The Podfile's
// `react_native_post_install` already raises each pod's main target to the app's minimum, but
// it skips the pods' resource-bundle targets, so the SDWebImage (9.0) and ReachabilitySwift
// (12.0) bundles still fail the build there. This raises every target in the Pods project to
// the app's deployment target; on Xcode 26 it is a no-op for the build.
const MARKER = '# @generated withPodsDeploymentTargetFloor'
const ANCHOR = 'post_install do |installer|'
const SNIPPET = `    ${MARKER}
    min_ios = (defined?(podfile_properties) && podfile_properties['ios.deploymentTarget']) || '15.1'
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        current = config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current && Gem::Version.new(current) < Gem::Version.new(min_ios)
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = min_ios
        end
      end
    end
`

const withPodsDeploymentTargetFloor = (config) =>
  withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile',
      )
      const podfile = await fs.readFile(podfilePath, 'utf8')

      if (podfile.includes(MARKER)) {
        return config
      }
      if (!podfile.includes(ANCHOR)) {
        throw new Error(
          `withPodsDeploymentTargetFloor: could not find "${ANCHOR}" in ${podfilePath}`,
        )
      }

      await fs.writeFile(
        podfilePath,
        podfile.replace(ANCHOR, `${ANCHOR}\n${SNIPPET}`),
      )
      return config
    },
  ])

module.exports = withPodsDeploymentTargetFloor
