import { Block, Blockchain } from "./main";

describe("Blockchain", () => {
  beforeAll(() => {
    // always generate same hash for createGenesisBlock
    jest
      .spyOn(Blockchain.prototype, "createGenesisBlock")
      .mockImplementation(() => new Block(0, 0, null));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should create genesis block", () => {
    const blockchain = new Blockchain();
    expect(blockchain.chain.length).toBe(1);
  });

  it("should be tamper proof", () => {
    const blockchain = new Blockchain(2);

    blockchain.addBlock(
      new Block(1, 100, { from: "Alice", to: "Bob", amount: 4 })
    );
    blockchain.addBlock(
      new Block(2, 200, { from: "Bob", to: "Alice", amount: 7 })
    );

    expect(blockchain.isChainValid()).toBe(true);

    blockchain.chain[1].data.amount = 999;
    expect(blockchain.isChainValid()).toBe(false);

    blockchain.chain[1].hash = blockchain.chain[1].calculateHash();
    expect(blockchain.isChainValid()).toBe(false);
  });
});
