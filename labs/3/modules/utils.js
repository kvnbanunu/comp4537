const TEXT = require('../locals/en/en').TEXT;

exports.getDate = function(name) {
const d = new Date();
return `<p style="color:blue;">${TEXT.Greeting.replace('1', name).replace('2', d.toLocaleTimeString('en-US', { timeZone: 'Canada/Pacific' }))}</p>`;
};
