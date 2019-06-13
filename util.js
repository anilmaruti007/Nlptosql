module.exports = (query, intent, obj, cb) => {
    if (intent === 'A') {
        cb(query);
    } else if (intent === 'A1') {
        Object.keys(obj).forEach((data) => {
            query = query.replace('"" = ""', data + " = " + `'${obj[data]}'`);
        });
        cb(query);
    } else if (intent === 'AL') {
        Object.keys(obj).forEach((data) => {
            query = query.replace('"" like ""', `${data} like '%${obj[data]}%'`)
        })
        cb(query);
    } else if (intent === 'A2') {
        Object.keys(obj).forEach((data) => {
            query = query.replace('"" like ""', `${data} like '%${obj[data]}%'`);
        });
        cb(query);
    } else if (intent === 'AI') {
        Object.keys(obj).forEach((data) => {
            query = query.replace(`"" in ("", "", "")`, `${data} in ('${obj[data][0]}', '${obj[data][1]}', '${obj[data][2]}')`)
        })
        cb(query)
    } else if(intent === 'AIB'){
        Object.keys(obj).forEach((data) => {
            query = query.replace(`"" between "" and ""`, `${data} between  '${obj[data][0]}' and '${obj[data][1]}'`);
        })
        cb(query); 
    }
}






















// module.exports = (querries, Mldata, object, callback) => {
//     var query = querries[Mldata];
//     if ((Mldata !== "A3B" && Mldata !== "AI" && Mldata !== "A") && Object.keys(object).length !== 0) {
//         Object.keys(object).forEach((data) => {
//             query = query.replace('"" = ""', data + " = " + `'${object[data]}'`);
//         });
//         callback(query);
//     } else if (Mldata === "A3B") {
//         Object.keys(object).forEach((data) => {
//             if (data === 'yearmonth')
//                 query = query.replace(`"" between "" and ""`, `${data} between  '${object[data][0]}' and '${object[data][1]}'`);
//             else
//                 query = query.replace('"" = ""', data + " = " + `'${object[data]}'`);
//         });
//         callback(query);
//     } else if (Mldata === "AI") {
//         Object.keys(object).forEach((data) => {
//             query = query.replace(`"" in ("", "", "")`, `${data} in ('${object[data][0]}', '${object[data][1]}', '${object[data][2]}')`)
//         })
//         callback(query)
//     } else if (Mldata === "A" && Object.keys(object).length === 0) {
//         callback(query);
//     } else if (Mldata === "A" && Object.keys(object).length !== 0) {
//         query = querries["AL"];
//         Object.keys(object).forEach((data) => {
//             query = query.replace('"" like ""', `${data} like '%${object[data]}%'`)
//         })
//         callback(query);
//     } else {
//         callback('Data Not found!')
//     }
// }