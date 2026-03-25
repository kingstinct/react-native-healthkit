// swift-tools-version: 6.0
import PackageDescription

let package = Package(
  name: "HealthkitSwiftEmitter",
  platforms: [
    .macOS(.v13),
  ],
  products: [
    .executable(
      name: "HealthkitSwiftEmitter",
      targets: ["HealthkitSwiftEmitter"]
    ),
  ],
  dependencies: [
    .package(url: "https://github.com/swiftlang/swift-syntax.git", exact: "602.0.0")
  ],
  targets: [
    .executableTarget(
      name: "HealthkitSwiftEmitter",
      dependencies: [
        .product(name: "SwiftSyntax", package: "swift-syntax"),
        .product(name: "SwiftSyntaxBuilder", package: "swift-syntax"),
      ]
    ),
  ]
)
