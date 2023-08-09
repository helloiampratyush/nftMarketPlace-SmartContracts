"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callable = exports.ovm = void 0;
const tslib_1 = require("tslib");
/**
 * @packageDocumentation
 *
 * This file deals with contract helpers to deal with ethers.js contract abstractions
 */
const ethers_1 = require("ethers");
tslib_1.__exportStar(require("./generated/factories/LinkToken__factory"), exports);
// TODO: supported form TypeScript >= 3.8
// export * as ovm from './generated/ovm/LinkToken__factory'
const ovm = tslib_1.__importStar(require("./generated/ovm/factories/LinkToken__factory"));
exports.ovm = ovm;
function callable(oldContract, methods) {
    var _a;
    const oldAbi = oldContract.interface.abi;
    const newAbi = oldAbi.map((fragment) => {
        var _a, _b;
        if (!methods.includes((_a = fragment.name) !== null && _a !== void 0 ? _a : '')) {
            return fragment;
        }
        if (((_b = fragment) === null || _b === void 0 ? void 0 : _b.constant) === false) {
            return {
                ...fragment,
                stateMutability: 'view',
                constant: true,
            };
        }
        return {
            ...fragment,
            stateMutability: 'view',
        };
    });
    const contract = new ethers_1.ethers.Contract(oldContract.address, newAbi, (_a = oldContract.signer) !== null && _a !== void 0 ? _a : oldContract.provider);
    return contract;
}
exports.callable = callable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0dBSUc7QUFDSCxtQ0FBNEQ7QUFHNUQsbUZBQXdEO0FBRXhELHlDQUF5QztBQUN6Qyw0REFBNEQ7QUFDNUQsMEZBQW1FO0FBQzFELGtCQUFHO0FBZ0NaLFNBQWdCLFFBQVEsQ0FBQyxXQUE0QixFQUFFLE9BQWlCOztJQUN0RSxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQTtJQUN4QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7O1FBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxPQUFDLFFBQVEsQ0FBQyxJQUFJLG1DQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQzFDLE9BQU8sUUFBUSxDQUFBO1NBQ2hCO1FBRUQsSUFBSSxPQUFDLFFBQTZCLDBDQUFFLFFBQVEsTUFBSyxLQUFLLEVBQUU7WUFDdEQsT0FBTztnQkFDTCxHQUFHLFFBQVE7Z0JBQ1gsZUFBZSxFQUFFLE1BQU07Z0JBQ3ZCLFFBQVEsRUFBRSxJQUFJO2FBQ2YsQ0FBQTtTQUNGO1FBQ0QsT0FBTztZQUNMLEdBQUcsUUFBUTtZQUNYLGVBQWUsRUFBRSxNQUFNO1NBQ3hCLENBQUE7SUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNGLE1BQU0sUUFBUSxHQUFHLElBQUksZUFBTSxDQUFDLFFBQVEsQ0FDbEMsV0FBVyxDQUFDLE9BQU8sRUFDbkIsTUFBTSxRQUNOLFdBQVcsQ0FBQyxNQUFNLG1DQUFJLFdBQVcsQ0FBQyxRQUFRLENBQzNDLENBQUE7SUFFRCxPQUFPLFFBQVEsQ0FBQTtBQUNqQixDQUFDO0FBMUJELDRCQTBCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGRlYWxzIHdpdGggY29udHJhY3QgaGVscGVycyB0byBkZWFsIHdpdGggZXRoZXJzLmpzIGNvbnRyYWN0IGFic3RyYWN0aW9uc1xuICovXG5pbXBvcnQgeyBldGhlcnMsIFNpZ25lciwgQ29udHJhY3RUcmFuc2FjdGlvbiB9IGZyb20gJ2V0aGVycydcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAnZXRoZXJzL3Byb3ZpZGVycydcbmltcG9ydCB7IEZ1bmN0aW9uRnJhZ21lbnQgfSBmcm9tICdldGhlcnMvdXRpbHMnXG5leHBvcnQgKiBmcm9tICcuL2dlbmVyYXRlZC9mYWN0b3JpZXMvTGlua1Rva2VuX19mYWN0b3J5J1xuXG4vLyBUT0RPOiBzdXBwb3J0ZWQgZm9ybSBUeXBlU2NyaXB0ID49IDMuOFxuLy8gZXhwb3J0ICogYXMgb3ZtIGZyb20gJy4vZ2VuZXJhdGVkL292bS9MaW5rVG9rZW5fX2ZhY3RvcnknXG5pbXBvcnQgKiBhcyBvdm0gZnJvbSAnLi9nZW5lcmF0ZWQvb3ZtL2ZhY3Rvcmllcy9MaW5rVG9rZW5fX2ZhY3RvcnknXG5leHBvcnQgeyBvdm0gfVxuXG4vKipcbiAqIFRoZSB0eXBlIG9mIGFueSBmdW5jdGlvbiB0aGF0IGlzIGRlcGxveWFibGVcbiAqL1xudHlwZSBEZXBsb3lhYmxlID0ge1xuICBkZXBsb3k6ICguLi5kZXBsb3lBcmdzOiBhbnlbXSkgPT4gUHJvbWlzZTxhbnk+XG59XG5cbi8qKlxuICogR2V0IHRoZSByZXR1cm4gdHlwZSBvZiBhIGZ1bmN0aW9uLCBhbmQgdW5ib3ggYW55IHByb21pc2VzXG4gKi9cbmV4cG9ydCB0eXBlIEluc3RhbmNlPFQgZXh0ZW5kcyBEZXBsb3lhYmxlPiA9IFQgZXh0ZW5kcyB7XG4gIGRlcGxveTogKC4uLmRlcGxveUFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGluZmVyIFU+XG59XG4gID8gVVxuICA6IG5ldmVyXG5cbnR5cGUgT3ZlcnJpZGU8VD4gPSB7XG4gIFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPENvbnRyYWN0VHJhbnNhY3Rpb24+XG4gICAgPyAoLi4uYXJnczogYW55W10pID0+IFByb21pc2U8YW55PlxuICAgIDogVFtLXVxufVxuXG5leHBvcnQgdHlwZSBDYWxsYWJsZU92ZXJyaWRlSW5zdGFuY2U8VCBleHRlbmRzIERlcGxveWFibGU+ID0gVCBleHRlbmRzIHtcbiAgZGVwbG95OiAoLi4uZGVwbG95QXJnczogYW55W10pID0+IFByb21pc2U8aW5mZXIgQ29udHJhY3RJbnRlcmZhY2U+XG59XG4gID8gT21pdDxPdmVycmlkZTxDb250cmFjdEludGVyZmFjZT4sICdjb25uZWN0Jz4gJiB7XG4gICAgICBjb25uZWN0KHNpZ25lcjogc3RyaW5nIHwgU2lnbmVyIHwgUHJvdmlkZXIpOiBDYWxsYWJsZU92ZXJyaWRlSW5zdGFuY2U8VD5cbiAgICB9XG4gIDogbmV2ZXJcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGxhYmxlKG9sZENvbnRyYWN0OiBldGhlcnMuQ29udHJhY3QsIG1ldGhvZHM6IHN0cmluZ1tdKTogYW55IHtcbiAgY29uc3Qgb2xkQWJpID0gb2xkQ29udHJhY3QuaW50ZXJmYWNlLmFiaVxuICBjb25zdCBuZXdBYmkgPSBvbGRBYmkubWFwKChmcmFnbWVudCkgPT4ge1xuICAgIGlmICghbWV0aG9kcy5pbmNsdWRlcyhmcmFnbWVudC5uYW1lID8/ICcnKSkge1xuICAgICAgcmV0dXJuIGZyYWdtZW50XG4gICAgfVxuXG4gICAgaWYgKChmcmFnbWVudCBhcyBGdW5jdGlvbkZyYWdtZW50KT8uY29uc3RhbnQgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5mcmFnbWVudCxcbiAgICAgICAgc3RhdGVNdXRhYmlsaXR5OiAndmlldycsXG4gICAgICAgIGNvbnN0YW50OiB0cnVlLFxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgLi4uZnJhZ21lbnQsXG4gICAgICBzdGF0ZU11dGFiaWxpdHk6ICd2aWV3JyxcbiAgICB9XG4gIH0pXG4gIGNvbnN0IGNvbnRyYWN0ID0gbmV3IGV0aGVycy5Db250cmFjdChcbiAgICBvbGRDb250cmFjdC5hZGRyZXNzLFxuICAgIG5ld0FiaSxcbiAgICBvbGRDb250cmFjdC5zaWduZXIgPz8gb2xkQ29udHJhY3QucHJvdmlkZXIsXG4gIClcblxuICByZXR1cm4gY29udHJhY3Rcbn1cbiJdfQ==