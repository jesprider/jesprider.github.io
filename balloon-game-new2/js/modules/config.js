module.exports = {
    //
    // общеигровые настройки
    //

    width: 640, // ширина канваса
    height: 960, // высота

    // цвет фона
    bgColor: '#6ee5dd',
    groundColorUp: '#00a651',
    groundColorDown: '#7cc576',
    hoseColor: '#f26122',

    groundUpWidth: 10,
    groundDownWidth: 20,
    groundWidth: this.groundUpWidth + this.groundDownWidth,

    // времени до появления первого артифакта (условные единицы)
    firstArtifact: 100,

    // параметры для облаков вверху экрана
    wave: {
        x: -25, // x coord of first circle
        y: -40, // y coord of first circle
        r: 50, // circle radius
        time: 0, // we'll use this in calculating the sine wave
        offset: 0, // this will be the sine wave offset
        sinTime: 0.8, // коэффициент для синусоиды (меньше значение - дольше интервал)
        rangeIndex: 10 // коэффициент насколько сильно будут качаться облака (больше значение - больше дистанция)
    },

    // коэффициент для синусоиды (меньше значение - дольше интервал накачивания и спускания)
    timeOfBlowing: 0.5,


    //
    // настройки шарика
    //

    balloon: {
        // интенсивность надувания шарика
        blowingSpeed: 0.2,
        // коэффициент уменьшения шарика для начала игры
        minIndex: 0.2,
        // коэффициент сдутия шарика (blowingSpeed * unblowingIndex)
        unblowingIndex: 0.3,
        // как широко будет раскачиваться
        rangeIndex: 10
    },

    //
    // настройка артифакта
    //

    artifact: {
        // разброс скорости в пределах которого она может меняться
        speedRange: 4,
        // количество артифактов
        quantity: 4,
        // высота появления артифактов: heightRange * random + heightOfAppearing
        heightOfAppearing: -100,
        heightRange: -100,
        waveRange: 5
    }
};