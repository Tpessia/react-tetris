const configs = {
    container: {
        width: -1,
        height: -1
    },
    canvas: {
        width: -1,
        height: -1,
        backgroundColor: 'rgb(196,207,161)'
    },
    pixel: {
        offset: -1,
        widthT: -1,
        heightT: -1,
        width: 10,
        height: 10,
        backgroundColor: 'rgb(107,115,83)',
        strokeColor: 'rgb(65,65,65)',
        strokeWidth: 3
    }
}

configs.pixel.offset = configs.pixel.strokeWidth / 2

configs.pixel.widthT = configs.pixel.width + configs.pixel.strokeWidth
configs.pixel.heightT = configs.pixel.height + configs.pixel.strokeWidth

configs.canvas.width = configs.pixel.widthT * 20
configs.canvas.height = configs.pixel.heightT * 20

configs.container.width = configs.canvas.width
configs.container.height = configs.canvas.height

export default configs;