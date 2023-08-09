import { JSONRPCRequestPayload } from 'ethereum-types';
import { Subprovider } from './subprovider';
export interface GanacheOpts {
    verbose?: boolean;
    logger?: {
        log(msg: string): void;
    };
    port?: number;
    network_id?: number;
    networkId?: number;
    _chainId?: number;
    chainId?: number;
    mnemonic?: string;
    gasLimit?: number;
    vmErrorsOnRPCResponse?: boolean;
    db_path?: string;
    total_accounts?: number;
    fork?: string;
    blockTime?: number;
    hardfork?: string;
    unlocked_accounts?: string[];
}
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine) subprovider interface.
 * It intercepts all JSON RPC requests and relays them to an in-process ganache instance.
 */
export declare class GanacheSubprovider extends Subprovider {
    private readonly _ganacheProvider;
    /**
     * Instantiates a GanacheSubprovider
     * @param opts The desired opts with which to instantiate the Ganache provider
     */
    constructor(opts: GanacheOpts);
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param _next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    handleRequest(payload: JSONRPCRequestPayload, _next: () => void, end: (err: Error | null, data?: any) => void): Promise<void>;
}
//# sourceMappingURL=ganache.d.ts.map