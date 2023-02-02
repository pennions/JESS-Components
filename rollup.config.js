/** using vanilla rollup for the library part and vite for documentation */
import commonjs from '@rollup/plugin-commonjs';

export default [{
    input: 'components/jess-components.js',
    output: {
        name: 'jess-components',
        file: 'dist/jess-components.js',
        format: 'umd'
    },
    plugins: [commonjs()]
}, {
    input: 'components/jess-components.js',
    output: {
        name: 'jess-components',
        file: 'dist/jess-components.es.js',
        format: 'es'
    },
    plugins: [commonjs()]
}];