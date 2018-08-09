/**
 * @overview Documentation for the Google Calendar plugin.
 */

const docs = require('../../util/docs');

// prettier-ignore
module.exports = {
  init: docs.wrap([
    docs.block.text('Usage: timeline calendar init [options]'),
    docs.block.text('Initialise the Google Calendar plugin.'),
    docs.block.list('Options', [
      ['[--id]',  'Calendar id'],
    ]),
  ]),

  sync: docs.wrap([
    docs.block.text('Usage: timeline calendar sync'),
    docs.block.text('Sync all events to the Google Calendar.'),
  ]),

  reset: docs.wrap([
    docs.block.text('Usage: timeline calendar reset'),
    docs.block.text('Reset the Google Calendar plugin.'),
  ]),
};
