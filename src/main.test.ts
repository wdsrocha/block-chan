import { Block, Blockchain } from "./main";

describe("Blockchain", () => {
  it("should create genesis block", () => {
    const blockchain = new Blockchain();
    expect(blockchain.chain.length).toBe(1);
  });

  it("should be tamper proof", () => {
    const blockchain = new Blockchain();

    blockchain.addBlock(
      new Block(1, new Date(), { from: "Alice", to: "Bob", amount: 4 })
    );
    blockchain.addBlock(
      new Block(2, new Date(), { from: "Bob", to: "Alice", amount: 7 })
    );

    expect(blockchain.isChainValid()).toBe(true);

    blockchain.chain[1].data.amount = 999;
    expect(blockchain.isChainValid()).toBe(false);

    blockchain.chain[1].hash = blockchain.chain[1].calculateHash();
    expect(blockchain.isChainValid()).toBe(false);
  });
});
