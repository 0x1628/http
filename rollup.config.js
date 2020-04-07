import replace from 'rollup-plugin-replace'
import {uglify} from 'rollup-plugin-uglify'
import json from 'rollup-plugin-json'
import alias from 'rollup-plugin-alias'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const replacement = {'typeof window': 'true'}
const outputType = process.env.OUTPUT_TYPE || 'umd'

if (outputType === 'umd') {
  replacement['typeof wx'] = '"undefined"'
  replacement['typeof global.fetch'] = '"undefined"'
} else if (outputType === 'wx') {
  replacement['typeof wx'] = '""'
} else if (outputType === 'native') {
  replacement['typeof global.fetch'] = 'true'
} else if (outputType === 'node') {
  replacement['typeof global.fetch'] = '"undefined"'
  replacement['typeof wx'] = '"undefined"'
  replacement['typeof window'] = '"undefined"'
}

export default [{
  input: 'lib/index.js',
  output: {
    file: `dist/http.${outputType}.js`,
    format: outputType === 'node' ? 'cjs' : 'umd',
    name: 'http',
    esModule: false,
  },
  plugins: [
    // typescript(),
    // json(),
    replace(replacement),
    alias({
      entries: {
        ...outputType === 'umd' ? {} : {'whatwg-fetch': './fake'}
      },
    }),
    nodeResolve(),
    commonjs({
      ignore: ['node-fetch'],
    }),
    uglify(),
  ],
}]