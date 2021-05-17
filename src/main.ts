import { createHash } from "crypto";

export class Block {
  index: number;
  previousHash: string | null = null;
  hash: string | null;
  timestamp: Date;
  data: any;

  constructor(index: number, timestamp: Date, data: any) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return createHash("sha256")
      .update(
        this.index.toString() +
          (this.previousHash ?? "") +
          this.timestamp.toString() +
          JSON.stringify(this.data)
      )
      .digest("hex");
  }
}

export class Blockchain {
  chain: Array<Block>;

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(): Block {
    return new Block(0, new Date(), null);
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block: Block) {
    block.previousHash = this.getLastBlock().hash;
    block.hash = block.calculateHash();
    this.chain.push(block);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}
