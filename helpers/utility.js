
// Get current date and time in default database format
const getDbDateNow = () => {
    let curtDate = new Date() // new Date()
    return new Date(curtDate.getTime() - (curtDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' ')
}

// Add hours in current date and time db format
const addHourDbDateNow = (timeOffset) => {
    let curtDate = new Date(new Date().setHours(new Date().getHours() + timeOffset)) // new Date()
    let laterTime = new  Date(curtDate.getTime() - (curtDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' ')

    return laterTime
}

// Add minutes in current date and time db format
const addMinutesDbDate = (timeOffset) => {
    let curtTime = new Date(new Date().setMinutes(new Date().getMinutes() + 5)) // new Date()
    let laterTime = new  Date(curtTime.getTime() - (curtTime.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' ')
    return laterTime
}

// Convert database date and time format to javascript format
const getJSDateFromDb = (dbDate) =>{
    console.log('DB DATE: ', dbDate)
    dbDate = dbDate.toISOString().replace('Z', '').replace('T', ' ')
    // Split timestamp into [ Y, M, D, h, m, s ]
    var t = dbDate.split(/[- :]/);

    // Apply each element to the Date function
    var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
    return d
}

module.exports = {
    addHourDbDateNow,
    getDbDateNow,
    getJSDateFromDb,
    addMinutesDbDate
}