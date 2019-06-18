module.exports = {
    A: `select count(*) from nlptosql.nlp`,
    A1: `select count(*) from nlptosql.nlp where "" = ""`,
    A2: `select count(*) from nlptosql.nlp where "" like "" and "" like ""`,
    AI: 'select count(*) from nlptosql.nlp where "" in ("", "", "")',
    AIB: `select count(*) from nlptosql.nlp where "" between "" and ""`,
    AL: 'select count(*) from nlptosql.nlp where "" like ""',
    A2B: `select count(*) from nlptosql.nlp where "" like "" and "" between "" and ""`,
    A3: `select count(*) from nlptosql.nlp where "" like "" and "" like "" and "" like ""`
}