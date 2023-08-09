"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gasDiffLessThan = exports.eventDoesNotExist = exports.eventExists = exports.publicAbi = exports.evmRevert = exports.bigNum = void 0;
/**
 * @packageDocumentation
 *
 * This file contains a number of matcher functions meant to perform common assertions for
 * ethereum based tests. Specific assertion functions targeting chainlink smart contracts live in
 * their respective contracts/<contract>.ts file.
 */
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const debug_1 = require("./debug");
const helpers_1 = require("./helpers");
const debug = debug_1.makeDebug('helpers');
/**
 * Check that two big numbers are the same value.
 *
 * @param expected The expected value to match against
 * @param actual The actual value to match against the expected value
 * @param failureMessage Failure message to display if the actual value does not match the expected value.
 */
function bigNum(expected, actual, failureMessage) {
    const msg = failureMessage ? ': ' + failureMessage : '';
    chai_1.assert(ethers_1.ethers.utils.bigNumberify(expected).eq(ethers_1.ethers.utils.bigNumberify(actual)), `BigNum (expected)${expected} is not (actual)${actual} ${msg}`);
}
exports.bigNum = bigNum;
/**
 * Check that an evm operation reverts
 *
 * @param action The asynchronous action to execute, which should cause an evm revert.
 * @param msg The failure message to display if the action __does not__ throw
 */
async function evmRevert(action, msg) {
    const d = debug.extend('assertActionThrows');
    let e = undefined;
    try {
        if (typeof action === 'function') {
            await action();
        }
        else {
            await action;
        }
    }
    catch (error) {
        e = error;
    }
    d(e);
    if (!e) {
        chai_1.assert.exists(e, 'Expected an error to be raised');
        return;
    }
    chai_1.assert(e.message, 'Expected an error to contain a message');
    const ERROR_MESSAGES = ['invalid opcode', 'revert'];
    const hasErrored = ERROR_MESSAGES.some((msg) => { var _a; return (_a = e === null || e === void 0 ? void 0 : e.message) === null || _a === void 0 ? void 0 : _a.includes(msg); });
    if (msg) {
        expect(e.message).toMatch(msg);
    }
    chai_1.assert(hasErrored, `expected following error message to include ${ERROR_MESSAGES.join(' or ')}. Got: "${e.message}"`);
}
exports.evmRevert = evmRevert;
/**
 * Check that a contract's abi exposes the expected interface.
 *
 * @param contract The contract with the actual abi to check the expected exposed methods and getters against.
 * @param expectedPublic The expected public exposed methods and getters to match against the actual abi.
 */
function publicAbi(contract, expectedPublic) {
    const actualPublic = [];
    for (const method of contract.interface.abi) {
        if (method.type === 'function') {
            actualPublic.push(method.name);
        }
    }
    for (const method of actualPublic) {
        const index = expectedPublic.indexOf(method);
        chai_1.assert.isAtLeast(index, 0, `#${method} is NOT expected to be public`);
    }
    for (const method of expectedPublic) {
        const index = actualPublic.indexOf(method);
        chai_1.assert.isAtLeast(index, 0, `#${method} is expected to be public`);
    }
}
exports.publicAbi = publicAbi;
/**
 * Assert that an event exists
 *
 * @param receipt The contract receipt to find the event in
 * @param eventDescription A description of the event to search by
 */
function eventExists(receipt, eventDescription) {
    const event = helpers_1.findEventIn(receipt, eventDescription);
    if (!event) {
        throw Error(`Unable to find ${eventDescription.name} in transaction receipt`);
    }
    return event;
}
exports.eventExists = eventExists;
/**
 * Assert that an event doesnt exist
 *
 * @param receipt The contract receipt to find the event in
 * @param eventDescription A description of the event to search by
 */
function eventDoesNotExist(receipt, eventDescription) {
    const event = helpers_1.findEventIn(receipt, eventDescription);
    if (event) {
        throw Error(`Found ${eventDescription.name} in transaction receipt, when expecting no instances`);
    }
}
exports.eventDoesNotExist = eventDoesNotExist;
/**
 * Assert that an event doesnt exist
 *
 * @param max The maximum allowable gas difference
 * @param receipt1 The contract receipt to compare to
 * @param receipt2 The contract receipt with a gas difference
 */
function gasDiffLessThan(max, receipt1, receipt2) {
    var _a;
    chai_1.assert(receipt1, 'receipt1 is not present for gas comparison');
    chai_1.assert(receipt2, 'receipt2 is not present for gas comparison');
    const diff = (_a = receipt2.gasUsed) === null || _a === void 0 ? void 0 : _a.sub(receipt1.gasUsed || 0);
    chai_1.assert.isAbove(max, (diff === null || diff === void 0 ? void 0 : diff.toNumber()) || Infinity);
}
exports.gasDiffLessThan = gasDiffLessThan;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWF0Y2hlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0JBQTZCO0FBQzdCLG1DQUErQjtBQUcvQixtQ0FBbUM7QUFDbkMsdUNBQXVDO0FBQ3ZDLE1BQU0sS0FBSyxHQUFHLGlCQUFTLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFbEM7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsTUFBTSxDQUNwQixRQUFzQixFQUN0QixNQUFvQixFQUNwQixjQUF1QjtJQUV2QixNQUFNLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUN2RCxhQUFNLENBQ0osZUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ3pFLG9CQUFvQixRQUFRLG1CQUFtQixNQUFNLElBQUksR0FBRyxFQUFFLENBQy9ELENBQUE7QUFDSCxDQUFDO0FBVkQsd0JBVUM7QUFFRDs7Ozs7R0FLRztBQUNJLEtBQUssVUFBVSxTQUFTLENBQzdCLE1BQTJDLEVBQzNDLEdBQVk7SUFFWixNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUE7SUFDNUMsSUFBSSxDQUFDLEdBQXNCLFNBQVMsQ0FBQTtJQUVwQyxJQUFJO1FBQ0YsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLEVBQUU7WUFDaEMsTUFBTSxNQUFNLEVBQUUsQ0FBQTtTQUNmO2FBQU07WUFDTCxNQUFNLE1BQU0sQ0FBQTtTQUNiO0tBQ0Y7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLENBQUMsR0FBRyxLQUFLLENBQUE7S0FDVjtJQUNELENBQUMsQ0FBQyxDQUFDLENBQUMs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SSxTQUFHLFFBQVEsQ0FBQyxPQUFPLDBDQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ3pELGFBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUEsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFFBQVEsT0FBTSxRQUFRLENBQUMsQ0FBQTtBQUNuRCxDQUFDO0FBVEQsMENBU0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICpcbiAqIFRoaXMgZmlsZSBjb250YWlucyBhIG51bWJlciBvZiBtYXRjaGVyIGZ1bmN0aW9ucyBtZWFudCB0byBwZXJmb3JtIGNvbW1vbiBhc3NlcnRpb25zIGZvclxuICogZXRoZXJldW0gYmFzZWQgdGVzdHMuIFNwZWNpZmljIGFzc2VydGlvbiBmdW5jdGlvbnMgdGFyZ2V0aW5nIGNoYWlubGluayBzbWFydCBjb250cmFjdHMgbGl2ZSBpblxuICogdGhlaXIgcmVzcGVjdGl2ZSBjb250cmFjdHMvPGNvbnRyYWN0Pi50cyBmaWxlLlxuICovXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJ1xuaW1wb3J0IHsgZXRoZXJzIH0gZnJvbSAnZXRoZXJzJ1xuaW1wb3J0IHsgQ29udHJhY3RSZWNlaXB0IH0gZnJvbSAnZXRoZXJzL2NvbnRyYWN0J1xuaW1wb3J0IHsgQmlnTnVtYmVyaXNoLCBFdmVudERlc2NyaXB0aW9uIH0gZnJvbSAnZXRoZXJzL3V0aWxzJ1xuaW1wb3J0IHsgbWFrZURlYnVnIH0gZnJvbSAnLi9kZWJ1ZydcbmltcG9ydCB7IGZpbmRFdmVudEluIH0gZnJvbSAnLi9oZWxwZXJzJ1xuY29uc3QgZGVidWcgPSBtYWtlRGVidWcoJ2hlbHBlcnMnKVxuXG4vKipcbiAqIENoZWNrIHRoYXQgdHdvIGJpZyBudW1iZXJzIGFyZSB0aGUgc2FtZSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gZXhwZWN0ZWQgVGhlIGV4cGVjdGVkIHZhbHVlIHRvIG1hdGNoIGFnYWluc3RcbiAqIEBwYXJhbSBhY3R1YWwgVGhlIGFjdHVhbCB2YWx1ZSB0byBtYXRjaCBhZ2FpbnN0IHRoZSBleHBlY3RlZCB2YWx1ZVxuICogQHBhcmFtIGZhaWx1cmVNZXNzYWdlIEZhaWx1cmUgbWVzc2FnZSB0byBkaXNwbGF5IGlmIHRoZSBhY3R1YWwgdmFsdWUgZG9lcyBub3QgbWF0Y2ggdGhlIGV4cGVjdGVkIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmlnTnVtKFxuICBleHBlY3RlZDogQmlnTnVtYmVyaXNoLFxuICBhY3R1YWw6IEJpZ051bWJlcmlzaCxcbiAgZmFpbHVyZU1lc3NhZ2U/OiBzdHJpbmcsXG4pOiB2b2lkIHtcbiAgY29uc3QgbXNnID0gZmFpbHVyZU1lc3NhZ2UgPyAnOiAnICsgZmFpbHVyZU1lc3NhZ2UgOiAnJ1xuICBhc3NlcnQoXG4gICAgZXRoZXJzLnV0aWxzLmJpZ051bWJlcmlmeShleHBlY3RlZCkuZXEoZXRoZXJzLnV0aWxzLmJpZ051bWJlcmlmeShhY3R1YWwpKSxcbiAgICBgQmlnTnVtIChleHBlY3RlZCkke2V4cGVjdGVkfSBpcyBub3QgKGFjdHVhbCkke2FjdHVhbH0gJHttc2d9YCxcbiAgKVxufVxuXG4vKipcbiAqIENoZWNrIHRoYXQgYW4gZXZtIG9wZXJhdGlvbiByZXZlcnRzXG4gKlxuICogQHBhcmFtIGFjdGlvbiBUaGUgYXN5bmNocm9ub3VzIGFjdGlvbiB0byBleGVjdXRlLCB3aGljaCBzaG91bGQgY2F1c2UgYW4gZXZtIHJldmVydC5cbiAqIEBwYXJhbSBtc2cgVGhlIGZhaWx1cmUgbWVzc2FnZSB0byBkaXNwbGF5IGlmIHRoZSBhY3Rpb24gX19kb2VzIG5vdF9fIHRocm93XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBldm1SZXZlcnQoXG4gIGFjdGlvbjogKCgpID0+IFByb21pc2U8YW55PikgfCBQcm9taXNlPGFueT4sXG4gIG1zZz86IHN0cmluZyxcbikge1xuICBjb25zdCBkID0gZGVidWcuZXh0ZW5kKCdhc3NlcnRBY3Rpb25UaHJvd3MnKVxuICBsZXQgZTogRXJyb3IgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcblxuICB0cnkge1xuICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhd2FpdCBhY3Rpb24oKVxuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBhY3Rpb25cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yXG4gIH1cbiAgZChlKVxuICBpZiAoIWUpIHtcbiAgICBhc3NlcnQuZXhpc3RzKGUsICdFeHBlY3RlZCBhbiBlcnJvciB0byBiZSByYWlzZWQnKVxuICAgIHJldHVyblxuICB9XG5cbiAgYXNzZXJ0KGUubWVzc2FnZSwgJ0V4cGVjdGVkIGFuIGVycm9yIHRvIGNvbnRhaW4gYSBtZXNzYWdlJylcblxuICBjb25zdCBFUlJPUl9NRVNTQUdFUyA9IFsnaW52YWxpZCBvcGNvZGUnLCAncmV2ZXJ0J11cbiAgY29uc3QgaGFzRXJyb3JlZCA9IEVSUk9SX01FU1NBR0VTLnNvbWUoKG1zZykgPT4gZT8ubWVzc2FnZT8uaW5jbHVkZXMobXNnKSlcblxuICBpZiAobXNnKSB7XG4gICAgZXhwZWN0KGUubWVzc2FnZSkudG9NYXRjaChtc2cpXG4gIH1cblxuICBhc3NlcnQoXG4gICAgaGFzRXJyb3JlZCxcbiAgICBgZXhwZWN0ZWQgZm9sbG93aW5nIGVycm9yIG1lc3NhZ2UgdG8gaW5jbHVkZSAke0VSUk9SX01FU1NBR0VTLmpvaW4oXG4gICAgICAnIG9yICcsXG4gICAgKX0uIEdvdDogXCIke2UubWVzc2FnZX1cImAsXG4gIClcbn1cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgY29udHJhY3QncyBhYmkgZXhwb3NlcyB0aGUgZXhwZWN0ZWQgaW50ZXJmYWNlLlxuICpcbiAqIEBwYXJhbSBjb250cmFjdCBUaGUgY29udHJhY3Qgd2l0aCB0aGUgYWN0dWFsIGFiaSB0byBjaGVjayB0aGUgZXhwZWN0ZWQgZXhwb3NlZCBtZXRob2RzIGFuZCBnZXR0ZXJzIGFnYWluc3QuXG4gKiBAcGFyYW0gZXhwZWN0ZWRQdWJsaWMgVGhlIGV4cGVjdGVkIHB1YmxpYyBleHBvc2VkIG1ldGhvZHMgYW5kIGdldHRlcnMgdG8gbWF0Y2ggYWdhaW5zdCB0aGUgYWN0dWFsIGFiaS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHB1YmxpY0FiaShcbiAgY29udHJhY3Q6IGV0aGVycy5Db250cmFjdCB8IGV0aGVycy5Db250cmFjdEZhY3RvcnksXG4gIGV4cGVjdGVkUHVibGljOiBzdHJpbmdbXSxcbikge1xuICBjb25zdCBhY3R1YWxQdWJsaWMgPSBbXVxuICBmb3IgKGNvbnN0IG1ldGhvZCBvZiBjb250cmFjdC5pbnRlcmZhY2UuYWJpKSB7XG4gICAgaWYgKG1ldGhvZC50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhY3R1YWxQdWJsaWMucHVzaChtZXRob2QubmFtZSlcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IG1ldGhvZCBvZiBhY3R1YWxQdWJsaWMpIHtcbiAgICBjb25zdCBpbmRleCA9IGV4cGVjdGVkUHVibGljLmluZGV4T2YobWV0aG9kKVxuICAgIGFzc2VydC5pc0F0TGVhc3QoaW5kZXgsIDAsIGAjJHttZXRob2R9IGlzIE5PVCBleHBlY3RlZCB0byBiZSBwdWJsaWNgKVxuICB9XG5cbiAgZm9yIChjb25zdCBtZXRob2Qgb2YgZXhwZWN0ZWRQdWJsaWMpIHtcbiAgICBjb25zdCBpbmRleCA9IGFjdHVhbFB1YmxpYy5pbmRleE9mKG1ldGhvZClcbiAgICBhc3NlcnQuaXNBdExlYXN0KGluZGV4LCAwLCBgIyR7bWV0aG9kfSBpcyBleHBlY3RlZCB0byBiZSBwdWJsaWNgKVxuICB9XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgYW4gZXZlbnQgZXhpc3RzXG4gKlxuICogQHBhcmFtIHJlY2VpcHQgVGhlIGNvbnRyYWN0IHJlY2VpcHQgdG8gZmluZCB0aGUgZXZlbnQgaW5cbiAqIEBwYXJhbSBldmVudERlc2NyaXB0aW9uIEEgZGVzY3JpcHRpb24gb2YgdGhlIGV2ZW50IHRvIHNlYXJjaCBieVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXZlbnRFeGlzdHMoXG4gIHJlY2VpcHQ6IENvbnRyYWN0UmVjZWlwdCxcbiAgZXZlbnREZXNjcmlwdGlvbjogRXZlbnREZXNjcmlwdGlvbixcbik6IGV0aGVycy5FdmVudCB7XG4gIGNvbnN0IGV2ZW50ID0gZmluZEV2ZW50SW4ocmVjZWlwdCwgZXZlbnREZXNjcmlwdGlvbilcbiAgaWYgKCFldmVudCkge1xuICAgIHRocm93IEVycm9yKFxuICAgICAgYFVuYWJsZSB0byBmaW5kICR7ZXZlbnREZXNjcmlwdGlvbi5uYW1lfSBpbiB0cmFuc2FjdGlvbiByZWNlaXB0YCxcbiAgICApXG4gIH1cblxuICByZXR1cm4gZXZlbnRcbn1cblxuLyoqXG4gKiBBc3NlcnQgdGhhdCBhbiBldmVudCBkb2VzbnQgZXhpc3RcbiAqXG4gKiBAcGFyYW0gcmVjZWlwdCBUaGUgY29udHJhY3QgcmVjZWlwdCB0byBmaW5kIHRoZSBldmVudCBpblxuICogQHBhcmFtIGV2ZW50RGVzY3JpcHRpb24gQSBkZXNjcmlwdGlvbiBvZiB0aGUgZXZlbnQgdG8gc2VhcmNoIGJ5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBldmVudERvZXNOb3RFeGlzdChcbiAgcmVjZWlwdDogQ29udHJhY3RSZWNlaXB0LFxuICBldmVudERlc2NyaXB0aW9uOiBFdmVudERlc2NyaXB0aW9uLFxuKSB7XG4gIGNvbnN0IGV2ZW50ID0gZmluZEV2ZW50SW4ocmVjZWlwdCwgZXZlbnREZXNjcmlwdGlvbilcbiAgaWYgKGV2ZW50KSB7XG4gICAgdGhyb3cgRXJyb3IoXG4gICAgICBgRm91bmQgJHtldmVudERlc2NyaXB0aW9uLm5hbWV9IGluIHRyYW5zYWN0aW9uIHJlY2VpcHQsIHdoZW4gZXhwZWN0aW5nIG5vIGluc3RhbmNlc2AsXG4gICAgKVxuICB9XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgYW4gZXZlbnQgZG9lc250IGV4aXN0XG4gKlxuICogQHBhcmFtIG1heCBUaGUgbWF4aW11bSBhbGxvd2FibGUgZ2FzIGRpZmZlcmVuY2VcbiAqIEBwYXJhbSByZWNlaXB0MSBUaGUgY29udHJhY3QgcmVjZWlwdCB0byBjb21wYXJlIHRvXG4gKiBAcGFyYW0gcmVjZWlwdDIgVGhlIGNvbnRyYWN0IHJlY2VpcHQgd2l0aCBhIGdhcyBkaWZmZXJlbmNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnYXNEaWZmTGVzc1RoYW4oXG4gIG1heDogbnVtYmVyLFxuICByZWNlaXB0MTogQ29udHJhY3RSZWNlaXB0LFxuICByZWNlaXB0MjogQ29udHJhY3RSZWNlaXB0LFxuKSB7XG4gIGFzc2VydChyZWNlaXB0MSwgJ3JlY2VpcHQxIGlzIG5vdCBwcmVzZW50IGZvciBnYXMgY29tcGFyaXNvbicpXG4gIGFzc2VydChyZWNlaXB0MiwgJ3JlY2VpcHQyIGlzIG5vdCBwcmVzZW50IGZvciBnYXMgY29tcGFyaXNvbicpXG4gIGNvbnN0IGRpZmYgPSByZWNlaXB0Mi5nYXNVc2VkPy5zdWIocmVjZWlwdDEuZ2FzVXNlZCB8fCAwKVxuICBhc3NlcnQuaXNBYm92ZShtYXgsIGRpZmY/LnRvTnVtYmVyKCkgfHwgSW5maW5pdHkpXG59XG4iXX0=