"use strict";
/**
 * @packageDocumentation
 *
 * This file provides utility functions related to test setup, such as creating a test provider,
 * optimizing test times via snapshots, and making test accounts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.snapshot = exports.provider = void 0;
const tslib_1 = require("tslib");
const sol_trace_1 = require("@0x/sol-trace");
const subproviders_1 = require("@0x/subproviders");
const ethers_1 = require("ethers");
const path = tslib_1.__importStar(require("path"));
const debug_1 = require("./debug");
const wallet_1 = require("./wallet");
const helpers_1 = require("./helpers");
const subproviders_2 = require("./subproviders");
const debug = debug_1.makeDebug('helpers');
const OVM_BLOCK_GAS_LIMIT = 9000000;
const EVM_BLOCK_GAS_LIMIT = 8000000;
/**
 * Create a test provider which uses an in-memory, in-process chain
 */
function provider() {
    const providerEngine = new sol_trace_1.Web3ProviderEngine();
    // OVM CHANGE: sol-trace does not seem to work on OVM
    if (process.env.DEBUG && !helpers_1.isOVM()) {
        debug('Debugging enabled, using sol-trace module...');
        const defaultFromAddress = '';
        const artifactAdapter = new sol_trace_1.SolCompilerArtifactAdapter(path.resolve('dist/artifacts'), path.resolve('contracts'));
        const revertTraceSubprovider = new sol_trace_1.RevertTraceSubprovider(artifactAdapter, defaultFromAddress, true);
        providerEngine.addProvider(revertTraceSubprovider);
    }
    // Ganache does a poor job of estimating gas, so just crank it up for testing.
    if (!helpers_1.isOVM()) {
        const gasAmount = 5 * 10 ** 6;
        providerEngine.addProvider(new subproviders_1.FakeGasEstimateSubprovider(gasAmount));
    }
    const options = {
        gasLimit: helpers_1.isOVM() ? OVM_BLOCK_GAS_LIMIT : EVM_BLOCK_GAS_LIMIT,
    };
    const ganacheProvider = helpers_1.isOVM()
        ? new subproviders_2.OVMGanacheSubprovider(options)
        : new subproviders_1.GanacheSubprovider(options);
    providerEngine.addProvider(ganacheProvider);
    providerEngine.start();
    return new ethers_1.ethers.providers.Web3Provider(providerEngine);
}
exports.provider = provider;
/**
 * This helper function allows us to make use of ganache snapshots,
 * which allows us to snapshot one state instance and revert back to it.
 *
 * This is used to memoize expensive setup calls typically found in beforeEach hooks when we
 * need to setup our state with contract deployments before running assertions.
 *
 * @param provider The provider that's used within the tests
 * @param cb The callback to execute that generates the state we want to snapshot
 */
function snapshot(provider, cb) {
    if (process.env.DEBUG) {
        debug('Debugging enabled, snapshot mode disabled...');
        return cb;
    }
    const d = debug.extend('memoizeDeploy');
    let hasDeployed = false;
    let snapshotId = '';
    return async () => {
        if (!hasDeployed) {
            d('executing deployment..');
            await cb();
            d('snapshotting...');
            /* eslint-disable-next-line require-atomic-updates */
            snapshotId = await provider.send('evm_snapshot', undefined);
            d('snapshot id:%s', snapshotId);
            /* eslint-disable-next-line require-atomic-updates */
            hasDeployed = true;
        }
        else {
            d('reverting to snapshot: %s', snapshotId);
            await provider.send('evm_revert', snapshotId);
            d('re-creating snapshot..');
            /* eslint-disable-next-line require-atomic-updates */
            snapshotId = await provider.send('evm_snapshot', undefined);
            d('recreated snapshot id:%s', snapshotId);
        }
    };
}
exports.snapshot = snapshot;
/**
 * Generate roles and personas for tests along with their correlated account addresses
 */
async function users(provider) {
    const accounts = await Promise.all(Array(8)
        .fill(null)
        .map(async (_, i) => wallet_1.createFundedWallet(provider, i).then((w) => w.wallet)));
    const personas = {
        Default: accounts[0],
        Neil: accounts[1],
        Ned: accounts[2],
        Nelly: accounts[3],
        Nancy: accounts[4],
        Norbert: accounts[5],
        Carol: accounts[6],
        Eddy: accounts[7],
    };
    const roles = {
        defaultAccount: accounts[0],
        oracleNode: accounts[1],
        oracleNode1: accounts[2],
        oracleNode2: accounts[3],
        oracleNode3: accounts[4],
        oracleNode4: accounts[5],
        stranger: accounts[6],
        consumer: accounts[7],
    };
    return { personas, roles };
}
exports.users = users;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2V0dXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztHQUtHOzs7O0FBRUgsNkNBSXNCO0FBQ3RCLG1EQUd5QjtBQUN6QixtQ0FBK0I7QUFDL0IsbURBQTRCO0FBQzVCLG1DQUFtQztBQUNuQyxxQ0FBNkM7QUFDN0MsdUNBQWlDO0FBQ2pDLGlEQUFzRDtBQUV0RCxNQUFNLEtBQUssR0FBRyxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRWxDLE1BQU0sbUJBQW1CLEdBQUcsT0FBUyxDQUFBO0FBQ3JDLE1BQU0sbUJBQW1CLEdBQUcsT0FBUyxDQUFBO0FBRXJDOztHQUVHO0FBQ0gsU0FBZ0IsUUFBUTtJQUN0QixNQUFNLGNBQWMsR0FBRyxJQUFJLDhCQUFrQixFQUFFLENBQUE7SUFFL0MscURBQXFEO0lBQ3JELElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxlQUFLLEVBQUUsRUFBRTtRQUNqQyxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQTtRQUNyRCxNQUFNLGtCQUFrQixHQUFHLEVBQUUsQ0FBQTtRQUM3QixNQUFNLGVBQWUsR0FBRyxJQUFJLHNDQUEwQixDQUNwRCxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEVBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQzFCLENBQUE7UUFDRCxNQUFNLHNCQUFzQixHQUFHLElBQUksa0NBQXNCLENBQ3ZELGVBQWUsRUFDZixrQkFBa0IsRUFDbEIsSUFBSSxDQUNMLENBQUE7UUFDRCxjQUFjLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUE7S0FDbkQ7SUFFRCw4RUFBOEU7SUFDOUUsSUFBSSxDQUFDLGVBQUssRUFBRSxFQUFFO1FBQ1osTUFBTSxTQUFTLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDN0IsY0FBYyxDQUFD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QUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0tBQ2xCLENBQUE7SUFFRCxNQUFNLEtBQUssR0FBVTtRQUNuQixjQUFjLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMzQixVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN2QixXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN4QixXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN4QixXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN4QixXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN4QixRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNyQixRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztLQUN0QixDQUFBO0lBRUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQTtBQUM1QixDQUFDO0FBbENELHNCQWtDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKlxuICogVGhpcyBmaWxlIHByb3ZpZGVzIHV0aWxpdHkgZnVuY3Rpb25zIHJlbGF0ZWQgdG8gdGVzdCBzZXR1cCwgc3VjaCBhcyBjcmVhdGluZyBhIHRlc3QgcHJvdmlkZXIsXG4gKiBvcHRpbWl6aW5nIHRlc3QgdGltZXMgdmlhIHNuYXBzaG90cywgYW5kIG1ha2luZyB0ZXN0IGFjY291bnRzLlxuICovXG5cbmltcG9ydCB7XG4gIFJldmVydFRyYWNlU3VicHJvdmlkZXIsXG4gIFNvbENvbXBpbGVyQXJ0aWZhY3RBZGFwdGVyLFxuICBXZWIzUHJvdmlkZXJFbmdpbmUsXG59IGZyb20gJ0AweC9zb2wtdHJhY2UnXG5pbXBvcnQge1xuICBGYWtlR2FzRXN0aW1hdGVTdWJwcm92aWRlcixcbiAgR2FuYWNoZVN1YnByb3ZpZGVyLFxufSBmcm9tICdAMHgvc3VicHJvdmlkZXJzJ1xuaW1wb3J0IHsgZXRoZXJzIH0gZnJvbSAnZXRoZXJzJ1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgbWFrZURlYnVnIH0gZnJvbSAnLi9kZWJ1ZydcbmltcG9ydCB7IGNyZWF0ZUZ1bmRlZFdhbGxldCB9IGZyb20gJy4vd2FsbGV0J1xuaW1wb3J0IHsgaXNPVk0gfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgeyBPVk1HYW5hY2hlU3VicHJvdmlkZXIgfSBmcm9tICcuL3N1YnByb3ZpZGVycydcblxuY29uc3QgZGVidWcgPSBtYWtlRGVidWcoJ2hlbHBlcnMnKVxuXG5jb25zdCBPVk1fQkxPQ0tfR0FTX0xJTUlUID0gOV8wMDBfMDAwXG5jb25zdCBFVk1fQkxPQ0tfR0FTX0xJTUlUID0gOF8wMDBfMDAwXG5cbi8qKlxuICogQ3JlYXRlIGEgdGVzdCBwcm92aWRlciB3aGljaCB1c2VzIGFuIGluLW1lbW9yeSwgaW4tcHJvY2VzcyBjaGFpblxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZXIoKTogZXRoZXJzLnByb3ZpZGVycy5Kc29uUnBjUHJvdmlkZXIge1xuICBjb25zdCBwcm92aWRlckVuZ2luZSA9IG5ldyBXZWIzUHJvdmlkZXJFbmdpbmUoKVxuXG4gIC8vIE9WTSBDSEFOR0U6IHNvbC10cmFjZSBkb2VzIG5vdCBzZWVtIHRvIHdvcmsgb24gT1ZNXG4gIGlmIChwcm9jZXNzLmVudi5ERUJVRyAmJiAhaXNPVk0oKSkge1xuICAgIGRlYnVnKCdEZWJ1Z2dpbmcgZW5hYmxlZCwgdXNpbmcgc29sLXRyYWNlIG1vZHVsZS4uLicpXG4gICAgY29uc3QgZGVmYXVsdEZyb21BZGRyZXNzID0gJydcbiAgICBjb25zdCBhcnRpZmFjdEFkYXB0ZXIgPSBuZXcgU29sQ29tcGlsZXJBcnRpZmFjdEFkYXB0ZXIoXG4gICAgICBwYXRoLnJlc29sdmUoJ2Rpc3QvYXJ0aWZhY3RzJyksXG4gICAgICBwYXRoLnJlc29sdmUoJ2NvbnRyYWN0cycpLFxuICAgIClcbiAgICBjb25zdCByZXZlcnRUcmFjZVN1YnByb3ZpZGVyID0gbmV3IFJldmVydFRyYWNlU3VicHJvdmlkZXIoXG4gICAgICBhcnRpZmFjdEFkYXB0ZXIsXG4gICAgICBkZWZhdWx0RnJvbUFkZHJlc3MsXG4gICAgICB0cnVlLFxuICAgIClcbiAgICBwcm92aWRlckVuZ2luZS5hZGRQcm92aWRlcihyZXZlcnRUcmFjZVN1YnByb3ZpZGVyKVxuICB9XG5cbiAgLy8gR2FuYWNoZSBkb2VzIGEgcG9vciBqb2Igb2YgZXN0aW1hdGluZyBnYXMsIHNvIGp1c3QgY3JhbmsgaXQgdXAgZm9yIHRlc3RpbmcuXG4gIGlmICghaXNPVk0oKSkge1xuICAgIGNvbnN0IGdhc0Ftb3VudCA9IDUgKiAxMCAqKiA2XG4gICAgcHJvdmlkZXJFbmdpbmUuYWRkUHJvdmlkZXIobmV3IEZha2VHYXNFc3RpbWF0ZVN1YnByb3ZpZGVyKGdhc0Ftb3VudCkpXG4gIH1cblxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIGdhc0xpbWl0OiBpc09WTSgpID8gT1ZNX0JMT0NLX0dBU19MSU1JVCA6IEVWTV9CTE9DS19HQVNfTElNSVQsXG4gIH1cblxuICBjb25zdCBnYW5hY2hlUHJvdmlkZXIgPSBpc09WTSgpXG4gICAgPyBuZXcgT1ZNR2FuYWNoZVN1YnByb3ZpZGVyKG9wdGlvbnMpXG4gICAgOiBuZXcgR2FuYWNoZVN1YnByb3ZpZGVyKG9wdGlvbnMpXG4gIHByb3ZpZGVyRW5naW5lLmFkZFByb3ZpZGVyKGdhbmFjaGVQcm92aWRlcilcblxuICBwcm92aWRlckVuZ2luZS5zdGFydCgpXG5cbiAgcmV0dXJuIG5ldyBldGhlcnMucHJvdmlkZXJzLldlYjNQcm92aWRlcihwcm92aWRlckVuZ2luZSlcbn1cblxuLyoqXG4gKiBUaGlzIGhlbHBlciBmdW5jdGlvbiBhbGxvd3MgdXMgdG8gbWFrZSB1c2Ugb2YgZ2FuYWNoZSBzbmFwc2hvdHMsXG4gKiB3aGljaCBhbGxvd3MgdXMgdG8gc25hcHNob3Qgb25lIHN0YXRlIGluc3RhbmNlIGFuZCByZXZlcnQgYmFjayB0byBpdC5cbiAqXG4gKiBUaGlzIGlzIHVzZWQgdG8gbWVtb2l6ZSBleHBlbnNpdmUgc2V0dXAgY2FsbHMgdHlwaWNhbGx5IGZvdW5kIGluIGJlZm9yZUVhY2ggaG9va3Mgd2hlbiB3ZVxuICogbmVlZCB0byBzZXR1cCBvdXIgc3RhdGUgd2l0aCBjb250cmFjdCBkZXBsb3ltZW50cyBiZWZvcmUgcnVubmluZyBhc3NlcnRpb25zLlxuICpcbiAqIEBwYXJhbSBwcm92aWRlciBUaGUgcHJvdmlkZXIgdGhhdCdzIHVzZWQgd2l0aGluIHRoZSB0ZXN0c1xuICogQHBhcmFtIGNiIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHRoYXQgZ2VuZXJhdGVzIHRoZSBzdGF0ZSB3ZSB3YW50IHRvIHNuYXBzaG90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzbmFwc2hvdChcbiAgcHJvdmlkZXI6IGV0aGVycy5wcm92aWRlcnMuSnNvblJwY1Byb3ZpZGVyLFxuICBjYjogKCkgPT4gUHJvbWlzZTx2b2lkPixcbikge1xuICBpZiAocHJvY2Vzcy5lbnYuREVCVUcpIHtcbiAgICBkZWJ1ZygnRGVidWdnaW5nIGVuYWJsZWQsIHNuYXBzaG90IG1vZGUgZGlzYWJsZWQuLi4nKVxuXG4gICAgcmV0dXJuIGNiXG4gIH1cblxuICBjb25zdCBkID0gZGVidWcuZXh0ZW5kKCdtZW1vaXplRGVwbG95JylcbiAgbGV0IGhhc0RlcGxveWVkID0gZmFsc2VcbiAgbGV0IHNuYXBzaG90SWQgPSAnJ1xuXG4gIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFoYXNEZXBsb3llZCkge1xuICAgICAgZCgnZXhlY3V0aW5nIGRlcGxveW1lbnQuLicpXG4gICAgICBhd2FpdCBjYigpXG5cbiAgICAgIGQoJ3NuYXBzaG90dGluZy4uLicpXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1hdG9taWMtdXBkYXRlcyAqL1xuICAgICAgc25hcHNob3RJZCA9IGF3YWl0IHByb3ZpZGVyLnNlbmQoJ2V2bV9zbmFwc2hvdCcsIHVuZGVmaW5lZClcbiAgICAgIGQoJ3NuYXBzaG90IGlkOiVzJywgc25hcHNob3RJZClcblxuICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtYXRvbWljLXVwZGF0ZXMgKi9cbiAgICAgIGhhc0RlcGxveWVkID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBkKCdyZXZlcnRpbmcgdG8gc25hcHNob3Q6ICVzJywgc25hcHNob3RJZClcbiAgICAgIGF3YWl0IHByb3ZpZGVyLnNlbmQoJ2V2bV9yZXZlcnQnLCBzbmFwc2hvdElkKVxuXG4gICAgICBkKCdyZS1jcmVhdGluZyBzbmFwc2hvdC4uJylcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWF0b21pYy11cGRhdGVzICovXG4gICAgICBzbmFwc2hvdElkID0gYXdhaXQgcHJvdmlkZXIuc2VuZCgnZXZtX3NuYXBzaG90JywgdW5kZWZpbmVkKVxuICAgICAgZCgncmVjcmVhdGVkIHNuYXBzaG90IGlkOiVzJywgc25hcHNob3RJZClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBSb2xlcyB7XG4gIGRlZmF1bHRBY2NvdW50OiBldGhlcnMuV2FsbGV0XG4gIG9yYWNsZU5vZGU6IGV0aGVycy5XYWxsZXRcbiAgb3JhY2xlTm9kZTE6IGV0aGVycy5XYWxsZXRcbiAgb3JhY2xlTm9kZTI6IGV0aGVycy5XYWxsZXRcbiAgb3JhY2xlTm9kZTM6IGV0aGVycy5XYWxsZXRcbiAgb3JhY2xlTm9kZTQ6IGV0aGVycy5XYWxsZXRcbiAgc3RyYW5nZXI6IGV0aGVycy5XYWxsZXRcbiAgY29uc3VtZXI6IGV0aGVycy5XYWxsZXRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQZXJzb25hcyB7XG4gIERlZmF1bHQ6IGV0aGVycy5XYWxsZXRcbiAgQ2Fyb2w6IGV0aGVycy5XYWxsZXRcbiAgRWRkeTogZXRoZXJzLldhbGxldFxuICBOYW5jeTogZXRoZXJzLldhbGxldFxuICBOZWQ6IGV0aGVycy5XYWxsZXRcbiAgTmVpbDogZXRoZXJzLldhbGxldFxuICBOZWxseTogZXRoZXJzLldhbGxldFxuICBOb3JiZXJ0OiBldGhlcnMuV2FsbGV0XG59XG5cbmludGVyZmFjZSBVc2VycyB7XG4gIHJvbGVzOiBSb2xlc1xuICBwZXJzb25hczogUGVyc29uYXNcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSByb2xlcyBhbmQgcGVyc29uYXMgZm9yIHRlc3RzIGFsb25nIHdpdGggdGhlaXIgY29ycmVsYXRlZCBhY2NvdW50IGFkZHJlc3Nlc1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlcnMoXG4gIHByb3ZpZGVyOiBldGhlcnMucHJvdmlkZXJzLkpzb25ScGNQcm92aWRlcixcbik6IFByb21pc2U8VXNlcnM+IHtcbiAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBBcnJheSg4KVxuICAgICAgLmZpbGwobnVsbClcbiAgICAgIC5tYXAoYXN5bmMgKF8sIGkpID0+XG4gICAgICAgIGNyZWF0ZUZ1bmRlZFdhbGxldChwcm92aWRlciwgaSkudGhlbigodykgPT4gdy53YWxsZXQpLFxuICAgICAgKSxcbiAgKVxuXG4gIGNvbnN0IHBlcnNvbmFzOiBQZXJzb25hcyA9IHtcbiAgICBEZWZhdWx0OiBhY2NvdW50c1swXSxcbiAgICBOZWlsOiBhY2NvdW50c1sxXSxcbiAgICBOZWQ6IGFjY291bnRzWzJdLFxuICAgIE5lbGx5OiBhY2NvdW50c1szXSxcbiAgICBOYW5jeTogYWNjb3VudHNbNF0sXG4gICAgTm9yYmVydDogYWNjb3VudHNbNV0sXG4gICAgQ2Fyb2w6IGFjY291bnRzWzZdLFxuICAgIEVkZHk6IGFjY291bnRzWzddLFxuICB9XG5cbiAgY29uc3Qgcm9sZXM6IFJvbGVzID0ge1xuICAgIGRlZmF1bHRBY2NvdW50OiBhY2NvdW50c1swXSxcbiAgICBvcmFjbGVOb2RlOiBhY2NvdW50c1sxXSxcbiAgICBvcmFjbGVOb2RlMTogYWNjb3VudHNbMl0sXG4gICAgb3JhY2xlTm9kZTI6IGFjY291bnRzWzNdLFxuICAgIG9yYWNsZU5vZGUzOiBhY2NvdW50c1s0XSxcbiAgICBvcmFjbGVOb2RlNDogYWNjb3VudHNbNV0sXG4gICAgc3RyYW5nZXI6IGFjY291bnRzWzZdLFxuICAgIGNvbnN1bWVyOiBhY2NvdW50c1s3XSxcbiAgfVxuXG4gIHJldHVybiB7IHBlcnNvbmFzLCByb2xlcyB9XG59XG4iXX0=