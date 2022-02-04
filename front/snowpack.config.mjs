export default {
    root: 'src',
    buildOptions: {
        out: 'build'
    },
    routes: [
        {
            match: 'routes',
            src: '.*',
            dest: '/index.html',
        }
    ],
};