module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    [
      'module-resolver',
      {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
          '@kingstinct/react-native-healthkit': '../src/index',
          'example': '../example',
          'example/src/App': '../example/src/App',
          'react': './node_modules/react',
          'react-native': './node_modules/react-native',
          'react-native-paper': './node_modules/react-native-paper',
          '@babel': './node_modules/@babel',
          'fbjs': './node_modules/fbjs',
          'hoist-non-react-statics': './node_modules/hoist-non-react-statics',
          'invariant': './node_modules/invariant',
        },
      },
    ],
  ],
}
