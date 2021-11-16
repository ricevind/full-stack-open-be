const morgan = require('morgan');


morgan.token('body', (req) => console.log(req.body) || JSON.stringify(req.body));
const logRequest = morgan(':method :url :status :total-time[3] :body');

module.exports = logRequest;
