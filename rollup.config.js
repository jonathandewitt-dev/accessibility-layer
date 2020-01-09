import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import sourcemaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'

export default {
	input: 'src/index.js',
	output: [
    {
      file: 'esm/addAccessibilityRules.min.mjs',
      format: 'esm',
      compact: true,
      sourcemap: true,
    },
    {
      file: 'umd/addAccessibilityRules.min.js',
      format: 'umd',
      name: 'AccessibilityLayer',
      compact: true,
    },
    {
      file: 'dist/addAccessibilityRules.min.js',
      format: 'cjs',
      compact: true,
    },
  ],
	plugins: [
    sourcemaps(),
		resolve(),
		babel({
			exclude: 'node_modules/**'
		}),
		terser(),
	],
}
