/** using vanilla rollup for the library part and vite for documentation */
import commonjs from '@rollup/plugin-commonjs';
import cssbundle from 'rollup-plugin-css-bundle';
import nodeResolve from '@rollup/plugin-node-resolve';

export default [{
    input: 'components/jess-components.js',
    output: {
        name: 'jess-components',
        file: 'dist/jess-components.js',
        format: 'umd',
    },
    plugins: [nodeResolve({
        modulesOnly: true
    }), commonjs(), cssbundle()]
}, {
    input: 'components/jess-components.js',
    output: {
        name: 'jess-components',
        file: 'dist/jess-components.es.js',
        format: 'es'
    },
    plugins: [nodeResolve({
        modulesOnly: true
    }), commonjs(), cssbundle()]
}];