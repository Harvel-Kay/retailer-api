
const day = 86_400_000
const month = 2_592_000_000

 function validDate(obj) {
    const fromdate = new Date(obj.fromdate)
    const todate = new Date(obj.todate)

    if (fromdate > todate) return "Invalid fromdate range";
    if (todate > new Date()) return "todate can't exceed the current time"
    if ((todate - fromdate) < day) return "Minimum Interval must be of one day"
    if ((todate - fromdate) > month) return "Maximum Interval must be of one month #Else Pay..."
    return null      
}

module.exports =validDate