exports.getYYMMDD = function(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

exports.getYYMMDD_time = function(id) {
    let lastTime;
    switch (id) {
        case 0:
            lastTime = 1;
            break;
        case 1:
            lastTime = 7;
            break;
        case 2:
            lastTime = 30;
            break;
    
        default:
            return null;
    }

    const date = new Date();
    date.setDate(date.getDate() - lastTime);
        
    const YYMMDD = exports.getYYMMDD(date);

    return YYMMDD;
}