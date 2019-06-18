const builder = require('botbuilder');

const restify = require('restify');

const apiai = require('apiai');

const sql = require('./SqlQuerries');

const app = apiai('5d0e0d60ddbd4c3f96abdd8b0e2f4f04');

const request = require('request-promise');

const inMemory = new builder.MemoryBotStorage();

const spellService = require('./spell-check');

const db = require('./db');

//create a server

const server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: '842079e2-bb56-428c-964f-37db4e069c9a',
    appPassword: 'nhMIUJ357]@@cfmxwIIS54;'
})


server.post('/api/messages', connector.listen())

var bot = new builder.UniversalBot(connector).set('storage', inMemory);

var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b74362c8-8b4e-4f46-b16b-3c2746ccb5b6?verbose=true&timezoneOffset=-360&subscription-key=e3fabb907a5a4a5ebd667fe402a4d897&q='

var recognizer = new builder.LuisRecognizer(model);

var intents = new builder.IntentDialog({
    recognizers: [recognizer]
});

bot.dialog('/', intents);

bot.on('conversationUpdate', (message) => {
    if (message.membersAdded) {
        console.log("Message " + JSON.stringify(message));
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, 'Introduce');
            }
        });
    }
})

//=======================================================================================================
//BING SPEECH
//=====================================================================================================
bot.use({
    botbuilder: function (session, next) {
        spellService.getCorrectedText(session.message.text).then(text => {
            session.message.text = text;
            next();
        })
            .catch((error) => {
                console.error(error);
                next();
            });
    }
});

bot.dialog('Introduce', [
    function (session) {
        session.send("Hi");
        setTimeout(function () {
            var commands = 'I can help you with the passangers Details';
            session.send(commands).endDialog();
        }, 100);
    }
])

intents.onDefault((session, args) => {
    // var message = session.message.text.toLowerCase();
    var entitys = [];
    entitys.push(args.entities);
    var Query = sql[args.intent];
    var obj = {}; var cArray = []; var aA = [], bA = [], Dates = [], i = 0;
    args.entities.forEach(ele => {
        var type = ele.type.toLowerCase();
        if (type === "builtin.datetimev2.daterange") {
            if (new Date(ele.entity).toDateString() !== 'Invalid Date' && ele.entity.length !== 4) {
                let month, date;
                date = new Date(ele.entity);
                if (date.getMonth() > 9) {
                    month = date.getMonth() + 1;
                } else {
                    month = `0${date.getMonth() + 1}`
                }
                obj[`Month${i}`] = date.getFullYear() + '-' + month;
                i++;
            } else {
                obj['yearmonth'] = [];
                if (ele.entity.toLowerCase() === "this year") {
                    let year = new Date().getFullYear();
                    obj['yearmonth'].push(year);
                } else if (Number(ele.entity).toString() !== "NaN") {
                    let year = new Date(ele.entity).getFullYear();
                    obj['yearmonth'].push(year);
                } else if (ele.entity.toLowerCase() === "last year" || ele.entity.toLowerCase() === 'previous year') {
                    let year = new Date().getFullYear() - 1;
                    obj['yearmonth'].push(year);
                } else if (ele.entity.toLowerCase() === "last month") {
                    let month = new Date().getFullYear() + '-' + new Date().getMonth();
                    obj['yearmonth'].push(month);
                } else {
                    require('./regex')(ele.entity).forEach((e) => {
                        let month, date, dumm;
                        dumm = e.trim();
                        if(new Date(e).toDateString() === 'Invalid Date'){
                            date = new Date(`${dumm} ${new Date().getFullYear()}`);
                        }else{
                            date = new Date(e);
                        }
                        if (date.getMonth() > 9) {
                            month = date.getMonth() + 1;
                        } else {
                            month = `0${date.getMonth() + 1}`
                        }
                        date = date.getFullYear() + '-' + month;
                        obj['yearmonth'].push(date);
                    })
                }
            }
        } else if (type === "builtin.datetimeV2.datetimerange") {

        } else if (type === 'builtin.geographyv2.countryregion') {
            cArray.push(ele.entity);
            obj['countryofresidence'] = cArray;
        } else if (type === 'status') {
            aA.push(ele.entity);
            obj[type] = aA;
        } else if (type === 'visa') {
            bA.push(ele.entity)
            obj[type] = bA;
        } else {
            obj[type] = ele.entity;
        }
    })
    Object.keys(obj).forEach((ele) => {
        if (ele.includes('Month')) {
            Dates.push(obj[ele]);
            delete obj[ele];
        }
    })
    if (Dates.length > 1) {
        var sorted = Dates.sort(sortMonths);
        obj['yearmonth'] = sorted[0];
        obj['monthofrelease'] = sorted[1];
    } else if (Dates.length == 0 && obj.yearmonth == undefined) {
        delete obj["yearmonth"];
    } else if (Dates.length == 1) {
        obj['yearmonth'] = Dates[0];
    }
    if (args.intent.toLowerCase() === 'a') {
        getUtilFun(Query, args.intent, obj, entitys, session);
    } else if (args.intent.toLowerCase() === 'a1') {
        getUtilFun(Query, args.intent, obj, entitys, session);
    } else if (args.intent.toLowerCase() === 'a2') {
        getUtilFun(Query, args.intent, obj, entitys, session);
    } else if (args.intent.toLowerCase() === 'ai') {
        getUtilFun(Query, args.intent, obj, entitys, session);
    } else if (args.intent.toLowerCase() === 'aib') {
        getUtilFun(Query, args.intent, obj, entitys, session);
    } else if (args.intent.toLowerCase() === 'al') {
        getUtilFun(Query, args.intent, obj, entitys, session);
    } else if (args.intent.toLowerCase() === 'a2b') {
        getUtilFun(Query, args.intent, obj, entitys, session);
    } else if (args.intent.toLowerCase() === 'none') {
        apiCall(session.message.text).then(result => {
            session.send(result)
        }).catch(err => {
            console.log(err);
        })
    } else {
        session.send("Intents doesn't matched!").endDialog();
    }
})

async function apiCall(userUtterance) {
    var a = userUtterance;
    var result = new Promise(async function(resolve, reject){
        var request = app.textRequest(a, {
            sessionId: '1234567891'
        });
        request.on('response', function (response) {
            var a = response;
            resolve(a["result"]["fulfillment"]["speech"]);
        });
        request.on('error', function (error) {
            reject(error);
        }); 
        request.end();
    });
    var final = await result;
    return final;
}

function getUtilFun(Query, intent, obj, entitys, session) {
    require('./util')(Query, intent, obj, (data) => {
        require('./dbexec')(data, entitys, session)
    })
}

function sortMonths(a, b) {
    var aDate = new Date(a);
    var bDate = new Date(b);
    return aDate.getTime() - bDate.getTime();
}