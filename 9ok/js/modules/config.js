module.exports = {
    //
    // общеигровые настройки
    //

    width: 640, // ширина канваса
    height: 960, // высота

    // цвет фона
    bgColor: '#45d4e0',
    groundColorUp: '#00a651',
    groundColorDown: '#7cc576',
    hoseColor: '#f26122',
    textColor: '#fff',
    tutorialColor: '#fff',

    groundUpWidth: 10,
    groundDownWidth: 20,
    groundWidth: 30,
    hoseWidth: 4,
    platformWidth: 50,
    platformHeight: 10,

    animalsNum: 14,

    tutorialQuantity: 4,

    // времени до появления первого артифакта (условные единицы)
    firstArtifact: 100,

    // коэффициент для синусоиды (меньше значение - дольше интервал накачивания и спускания)
    timeOfBlowing: 0.5,

    //
    // настройки шарика
    //

    balloon: {
        // интенсивность надувания шарика
        blowingSpeed: 0.3,
        // коэффициент уменьшения шарика для начала игры
        minIndex: 0.2,
        // коэффициент сдутия шарика (blowingSpeed * unblowingIndex)
        unblowingIndex: 0.3,
        // как широко будет раскачиваться
        waveRange: 5
    },

    //
    // настройка артифакта
    //

    artifact: {
        // разброс скорости в пределах которого она может меняться
        speedRange: 8,
        // количество артифактов
        quantity: 4,
        // высота появления артифактов: heightRange * random + heightOfAppearing
        heightOfAppearing: -100,
        heightRange: -100,
        waveRange: 20
    },

    pump: {
        animationSpeed: 5,
        waveRange: 30
    },

    cloud: {
        speedRange: 2,
        quantity: 2,
        leftRange: -200,
        leftOfAppearing: -300
    }
};