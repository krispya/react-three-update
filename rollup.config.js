import babel from '@rollup/plugin-babel';
import pkg from './package.json';
import pluginNodeResolve from '@rollup/plugin-node-resolve';

// These are our dependencies, everything else is in the bundle
const external = ['@react-three/fiber', 'react', 'react/jsx-runtime', 'three'];
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];

const getBabelOptions = ({ useESModules }, targets) => ({
  babelHelpers: 'runtime',
  babelrc: false,
  extensions,
  include: ['src/**/*', '**/node_modules/**'],
  plugins: [['@babel/transform-runtime', { regenerator: false, useESModules }]],
  presets: [
    ['@babel/preset-env', { loose: true, modules: false, targets }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
});

export default [
  {
    external,
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      pluginNodeResolve({ extensions }),
      babel(getBabelOptions({ useESModules: true }, '>1%, not dead, not ie 11, not op_mini all')),
    ],
  },
];
