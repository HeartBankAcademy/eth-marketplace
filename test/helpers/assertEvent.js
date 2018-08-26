// Adapted from:
// https://github.com/aragon/aragonOS/blob/c76fac8dba440185abee5c89816987ae10139895/test/helpers/assertEvent.js

/* eslint-disable no-undef */

module.exports = {
  assertEvent(receipt, eventName, instances = 1) {
    const events = receipt.logs.filter(x => x.event == eventName)
    assert.equal(events.length, instances, `'${eventName}' event should have been fired ${instances} times`)
  }
}
