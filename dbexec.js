const db = require('./db');

module.exports = (data, entitys, session) => {
    db.execute(data, function (err, result) {
        if (err) {
            session.send('I could not get it. As I am learning, Please specify the parameters separetly').endDialog();
        }
        else {
            var asd = entitys[0].filter((e) => { return e.entity !== "count" })
            msg = require('./responces')();
            msg = msg.hm
            var mainRes = msg[Math.floor(Math.random() * Math.floor(msg.length))];
            var ii = 0;
            asd.forEach(e => {
                if (e.type.toLowerCase() === 'builtin.geographyv2.countryregion') {
                    if (ii >= 1) {
                        mainRes = `${mainRes} and ${e.entity}`;
                    } else {
                        mainRes = `${mainRes} from ${e.entity}`;
                        ii++;
                    }
                }
                else if (e.type.toLowerCase() === 'builtin.datetimev2.daterange') {
                    mainRes = `${mainRes} in ${e.entity}`;
                }
                else if (e.type.toLowerCase() === 'status') {
                    mainRes = `${mainRes} with ${e.entity} visa status`
                }
    
            })
            session.send(`${mainRes} is ${JSON.stringify(Object.values(result[0])[0])}`).endDialog();
        }
    })
}
