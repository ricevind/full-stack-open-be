const createConsoleOut = (method) => (...params) => console[method](...params);

const info = createConsoleOut('log');
const error = createConsoleOut('error');


module.exports = {
    info, error
};
