const configs = {
    container: {
        width: -1,
        height: -1
    },
    canvas: {
        width: -1,
        height: -1,
        backgroundColor: 'transparent',
        patternBG: '#44444433',
        patternInnerBG: '#55555533',
        patternStroke: '#11111133',
        patternWidth: 1,
        gridWidth: 15,
        gridHeight: 17
    },
    pixel: {
        offset: -1,
        widthT: -1,
        heightT: -1,
        width: 10,
        height: 10,
        backgroundColor: '#BBB',
        strokeColor: '#555',
        strokeWidth: 3
    }
}

configs.pixel.offset = configs.pixel.strokeWidth / 2

configs.pixel.widthT = configs.pixel.width + configs.pixel.strokeWidth
configs.pixel.heightT = configs.pixel.height + configs.pixel.strokeWidth

configs.canvas.width = configs.pixel.widthT * configs.canvas.gridWidth
configs.canvas.height = configs.pixel.heightT * configs.canvas.gridHeight

configs.container.width = configs.canvas.width
configs.container.height = configs.canvas.height

export default configs;