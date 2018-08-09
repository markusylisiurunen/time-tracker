/**
 * @overview Plugin to integrate with Google Sheets.
 */

const ow = require('ow');
const { insertEvent } = require('./util');
const { getOptions } = require('../../util/options');

/**
 * Initialise the Google Sheets plugin.
 * @param {Object} args    Parsed arguments.
 * @param {Object} context Context object.
 */
let init = async (args, { configstore }) => {
  const options = await getOptions(args, [
    { name: 'id', flags: ['id'], question: { message: 'Spreadsheet id:' } },
    { name: 'sheet', flags: ['sheet'], question: { message: 'Sheet name:' } },
  ]);

  try {
    ow(options.id, ow.string.minLength(1));
    ow(options.sheet, ow.string.minLength(1));
  } catch (error) {
    console.log('Invalid options.');
    return;
  }

  configstore.set('sheets.id', options.id);
  configstore.set('sheets.sheet', options.sheet);

  console.log('Done.');
};

/**
 * Reset the Google Sheets plugin.
 * @param {Object} args    Parsed arguments.
 * @param {Object} context Context object.
 */
let reset = async (args, { configstore }) => {
  configstore.delete('sheets');
  console.log('Done.');
};

/**
 * Insert a new event to Google Sheets.
 * @param {Object} args    Parsed arguments.
 * @param {Object} context Context object.
 * @param {Object} event   Event to be added.
 */
let onEventAdd = async (args, { configstore }, event) => {
  const credentials = configstore.get('google.credentials');
  const { id, sheet } = configstore.get('sheets') || {};

  if (!(credentials && id && sheet)) {
    console.log('WARN (sheets): Event was not saved to Google Sheets.');
    return;
  }

  try {
    await insertEvent(credentials, id, sheet, event);
  } catch (error) {
    console.log('ERROR (sheets): Failed to save the event.');
  }
};

module.exports = async (args, context) => {
  const { commands, timeline } = context;

  init = init.bind(null, args, context);
  reset = reset.bind(null, args, context);
  onEventAdd = onEventAdd.bind(null, args, context);

  commands.register('sheets.init', init, 'Help: `sheets init`');
  commands.register('sheets.reset', reset, 'Help: `sheets reset`');

  timeline.on('event.add', onEventAdd);
};