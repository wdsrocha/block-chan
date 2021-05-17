import { createHash } from "crypto";

export class Block {
  index: number;
  previousHash: string | null = null;
  hash: string | null;
  timestamp: number;
  data: any;
  nonce: number = 0;

  constructor(index: number, timestamp: number, data: any) {
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
          JSON.stringify(this.data) +
          this.nonce
      )
      .digest("hex");
  }

  mineBlock(difficulty: number) {
    while (
      this.hash?.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

export class Blockchain {
  chain: Array<Block>;
  difficulty = 2;

  constructor(difficulty?: number) {
    this.chain = [this.createGenesisBlock()];
    if (difficulty) {
      this.difficulty = difficulty;
    }
  }

  createGenesisBlock(): Block {
    return new Block(0, Date.now(), null);
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block: Block) {
    block.previousHash = this.getLastBlock().hash;
    block.mineBlock(this.difficulty);
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
