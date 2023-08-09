"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OVMGanacheSubprovider = void 0;
const subproviders_1 = require("@0x/subproviders");
const ovm_plugins_1 = require("@krebernisak/ovm-plugins");
const debug_1 = require("../debug");
const log = debug_1.makeDebug('ovm-ganache-subprovider');
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine) subprovider interface.
 * It intercepts all JSON RPC requests and relays them to an in-process ganache instance.
 */
class OVMGanacheSubprovider extends subproviders_1.Subprovider {
    /**
     * Instantiates an OVMGanacheSubprovider
     * @param opts The desired opts with which to instantiate the Ganache provider
     */
    constructor(opts) {
        super();
        this.ganacheProvider = ovm_plugins_1.ganache.provider(opts);
    }
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param _next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    // tslint:disable-next-line:prefer-function-over-method async-suffix
    async handleRequest(payload, _next, end) {
        log(`sending request payload to ovm ganache: ${JSON.stringify(payload)}`);
        this.ganacheProvider.sendAsync(payload, (err, result) => {
            const resultStr = JSON.stringify(result).slice(0, 1000);
            const errStr = JSON.stringify(err);
            const message = `payload sent: result ${resultStr} [possibly truncated], err ${errStr}`;
            log(message);
            end(err, result && result.result);
        });
    }
}
exports.OVMGanacheSubprovider = OVMGanacheSubprovider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZtLWdhbmFjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3VicHJvdmlkZXJzL292bS1nYW5hY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1EQUF1RTtBQUN2RSwwREFBa0Q7QUFDbEQsb0NBQW9DO0FBRXBDLE1BQU0sR0FBRyxHQUFHLGlCQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUVoRDs7O0dBR0c7QUFDSCxNQUFhLHFCQUFzQixTQUFRLDBCQUFXO0lBRXBEOzs7T0FHRztJQUNILFlBQVksSUFBUztRQUNuQixLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxlQUFlLEdBQUcscUJBQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDL0MsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxvRUFBb0U7SUFDN0QsS0FBSyxDQUFDLGFBQWEsQ0FDeEIsT0FBOEIsRUFDOUIsS0FBZSxFQUNmLEdBQWtCO1FBRWxCLEdBQUcsQ0FBQywyQ0FBMkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDekUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQzVCLE9BQU8sRUFDUCxDQUFDLEdBQWlCLEVBQUUsTUFBVyxFQUFFLEVBQUU7WUFDakMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBQ3ZELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbEMsTUFBTSxPQUFPLEdBQUcsd0JBQXdCLFNBQVMsOEJBQThCLE1BQU0sRUFBRSxDQUFBO1lBQ3ZGLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNaLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNuQyxDQUFDLENBQ0YsQ0FBQTtJQUNILENBQUM7Q0FDRjtBQXJDRCxzREFxQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHYW5hY2hlUHJvdmlkZXIsIEpTT05SUENSZXF1ZXN0UGF5bG9hZCB9IGZyb20gJ2V0aGVyZXVtLXR5cGVzJ1xuaW1wb3J0IHsgU3VicHJvdmlkZXIsIENhbGxiYWNrLCBFcnJvckNhbGxiYWNrIH0gZnJvbSAnQDB4L3N1YnByb3ZpZGVycydcbmltcG9ydCB7IGdhbmFjaGUgfSBmcm9tICdAa3JlYmVybmlzYWsvb3ZtLXBsdWdpbnMnXG5pbXBvcnQgeyBtYWtlRGVidWcgfSBmcm9tICcuLi9kZWJ1ZydcblxuY29uc3QgbG9nID0gbWFrZURlYnVnKCdvdm0tZ2FuYWNoZS1zdWJwcm92aWRlcicpXG5cbi8qKlxuICogVGhpcyBjbGFzcyBpbXBsZW1lbnRzIHRoZSBbd2ViMy1wcm92aWRlci1lbmdpbmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9NZXRhTWFzay9wcm92aWRlci1lbmdpbmUpIHN1YnByb3ZpZGVyIGludGVyZmFjZS5cbiAqIEl0IGludGVyY2VwdHMgYWxsIEpTT04gUlBDIHJlcXVlc3RzIGFuZCByZWxheXMgdGhlbSB0byBhbiBpbi1wcm9jZXNzIGdhbmFjaGUgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBPVk1HYW5hY2hlU3VicHJvdmlkZXIgZXh0ZW5kcyBTdWJwcm92aWRlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZ2FuYWNoZVByb3ZpZGVyOiBHYW5hY2hlUHJvdmlkZXJcbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlcyBhbiBPVk1HYW5hY2hlU3VicHJvdmlkZXJcbiAgICogQHBhcmFtIG9wdHMgVGhlIGRlc2lyZWQgb3B0cyB3aXRoIHdoaWNoIHRvIGluc3RhbnRpYXRlIHRoZSBHYW5hY2hlIHByb3ZpZGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzOiBhbnkpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5nYW5hY2hlUHJvdmlkZXIgPSBnYW5hY2hlLnByb3ZpZGVyKG9wdHMpXG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgY29uZm9ybXMgdG8gdGhlIHdlYjMtcHJvdmlkZXItZW5naW5lIGludGVyZmFjZS5cbiAgICogSXQgaXMgY2FsbGVkIGludGVybmFsbHkgYnkgdGhlIFByb3ZpZGVyRW5naW5lIHdoZW4gaXQgaXMgdGhpcyBzdWJwcm92aWRlcnNcbiAgICogdHVybiB0byBoYW5kbGUgYSBKU09OIFJQQyByZXF1ZXN0LlxuICAgKiBAcGFyYW0gcGF5bG9hZCBKU09OIFJQQyBwYXlsb2FkXG4gICAqIEBwYXJhbSBfbmV4dCBDYWxsYmFjayB0byBjYWxsIGlmIHRoaXMgc3VicHJvdmlkZXIgZGVjaWRlcyBub3QgdG8gaGFuZGxlIHRoZSByZXF1ZXN0XG4gICAqIEBwYXJhbSBlbmQgQ2FsbGJhY2sgdG8gY2FsbCBpZiBzdWJwcm92aWRlciBoYW5kbGVkIHRoZSByZXF1ZXN0IGFuZCB3YW50cyB0byBwYXNzIGJhY2sgdGhlIHJlcXVlc3QuXG4gICAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZ1bmN0aW9uLW92ZXItbWV0aG9kIGFzeW5jLXN1ZmZpeFxuICBwdWJsaWMgYXN5bmMgaGFuZGxlUmVxdWVzdChcbiAgICBwYXlsb2FkOiBKU09OUlBDUmVxdWVzdFBheWxvYWQsXG4gICAgX25leHQ6IENhbGxiYWNrLFxuICAgIGVuZDogRXJyb3JDYWxsYmFjayxcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nKGBzZW5kaW5nIHJlcXVlc3QgcGF5bG9hZCB0byBvdm0gZ2FuYWNoZTogJHtKU09OLnN0cmluZ2lmeShwYXlsb2FkKX1gKVxuICAgIHRoaXMuZ2FuYWNoZVByb3ZpZGVyLnNlbmRBc3luYyhcbiAgICAgIHBheWxvYWQsXG4gICAgICAoZXJyOiBFcnJvciB8IG51bGwsIHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdFN0ciA9IEpTT04uc3RyaW5naWZ5KHJlc3VsdCkuc2xpY2UoMCwgMTAwMClcbiAgICAgICAgY29uc3QgZXJyU3RyID0gSlNPTi5zdHJpbmdpZnkoZXJyKVxuICAgICAgICBjb25zdCBtZXNzYWdlID0gYHBheWxvYWQgc2VudDogcmVzdWx0ICR7cmVzdWx0U3RyfSBbcG9zc2libHkgdHJ1bmNhdGVkXSwgZXJyICR7ZXJyU3RyfWBcbiAgICAgICAgbG9nKG1lc3NhZ2UpXG4gICAgICAgIGVuZChlcnIsIHJlc3VsdCAmJiByZXN1bHQucmVzdWx0KVxuICAgICAgfSxcbiAgICApXG4gIH1cbn1cbiJdfQ==