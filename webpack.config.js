import path from 'path';

export default {
    mode: 'development',
    entry: {
        map: './src/js/map.js',
        viewMap: './src/js/viewMap.js',
        mapHome: './src/js/mapHome.js',
        upLoadImage: './src/js/upLoadImage.js',
        changeState: './src/js/changeState.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    },
}