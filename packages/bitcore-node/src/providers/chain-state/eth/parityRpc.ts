import Web3 from 'web3';

if (Symbol['asyncIterator'] === undefined) (Symbol as any)['asyncIterator'] = Symbol.for('asyncIterator');

interface ParityBlockReward {
  author: string;
  rewardType: 'block';
  value: string;
}
interface ParityCall {
  callType: 'call';
  from: string;
  gas: string;
  input: string;
  to: string;
  value: string;
}
export interface ParityTraceResponse {
  action: ParityBlockReward | ParityCall;
  blockHash: string;
  blockNumber: number;
  result?: { gasUsed: string; output: string };
  subtraces: number;
  traceAddress: [];
  transactionHash?: string;
  transactionPosition?: number;
  type: 'reward' | 'call';
}

export class ParityRPC {
  web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  fromHex(val) {
    return this.web3.utils.toBN(val).toString() //toNumber()
  }

  public async *getTransactionsForAddress(blockFrom: number, address: string) {
    const txs = await this.scan(blockFrom, address);
    for (const tx of txs) {
      /** tx example:
        {
          "blockHash": "0x93001b557ccaad225bfbb8b1e6b42c0569be505c53cae79b20d14eef1107f581",
          "blockNumber": 116026,
          "subtraces": 0,
          "traceAddress": [],
          "transactionHash": "0xba1634109449b5b99afb0af4773991173e47fd434ffd54b0839040878860ab7a",
          "transactionPosition": 0,
          "type": "call"
          "action": {
            "callType": "call",
            "from": "0x478e524ef2a381d70c82588a93ca7a5fa9d51cbf",
            "gas": "0x10d88",
            "input": "0x",
            "to": "0x890fe11f3c24db8732d6c2e772e2297c7e65f139",
            "value": "0x18bbbd9daf13f900000"
          },
          "result": {
            "gasUsed": "0x0",
            "output": "0x"
          },
        },
      */
      yield {
        id: null,
        txid: tx.transactionHash,
        category: 'receive',
        height: tx.blockNumber,
        address,
        satoshis: this.fromHex(tx.action.value),
        fee: tx.result ? this.fromHex(tx.result.gasUsed) : null, //tx.action.gas
        outputIndex: tx.result ? tx.result.output : null,
        tx,
      };
    }
  }

  scan(blockFrom: number, address: string) {
    return new Promise<Array<ParityTraceResponse>>(resolve =>
      this.web3.eth.currentProvider.send({
        method: 'trace_filter',
        params: [{
          fromBlock: this.web3.utils.toHex(blockFrom),
          toBlock: 'latest',//this.web3.utils.toHex(toHeight),
          toAddress: [address.toLowerCase()],
        }/*,{
          fromBlock: this.web3.utils.toHex(blockFrom),
          toBlock: 'latest',//this.web3.utils.toHex(toHeight),
          fromAddress: [address.toLowerCase()],
        }*/],
        jsonrpc: '2.0',
        id: 0
      },
      (_, data) => {
        console.log('trace_filter', blockFrom, data.result);
        resolve(data.result || [] as Array<ParityTraceResponse>)
      })
    );
  }
}
