const Notus = artifacts.require("Notus.sol");

contract("Notus", (accounts) => {
  let notus;

  beforeEach(async () => {
    notus = await Notus.new()
  })

  describe("registerWebhook", () => {
    it("Fails to register if already exists", async () => {
      const ipfsHash = "0xabc123"
      const txn = await notus.registerWebhook(ipfsHash)
      assert.ok(txn.receipt.status)

      let errorThrown = false;
      try {
        await notus.registerWebhook(ipfsHash)
      } catch (err) {
        errorThrown = true
      }
      assert.isTrue(errorThrown)
    })

    it("Fails if ipfsHash is empty", async () => {
      const ipfsHash = []
      let errorThrown = false;
      try {
        await notus.registerWebhook(ipfsHash)
      } catch (err) {
        errorThrown = true
      }
      assert.isTrue(errorThrown)
    })

    it("Succeeds", async () => {
      const ipfsHash = "0xdef456"

      const txn = await notus.registerWebhook(ipfsHash)

      const [ firstLog ] = txn.receipt.logs
      assert.equal(firstLog.event, "Registered")
      const { owner, ipfsHash: argIpfsHash } = firstLog.args
      assert.equal(owner, accounts[0])
      assert.equal(argIpfsHash, ipfsHash)
      assert.equal(await notus.owner(ipfsHash), accounts[0])
    })
  })

  describe("unregisterWebhook", () => {
    it("Fails to register if does not exist", async () => {
      const ipfsHash = "0xabc123"

      let errorThrown = false;
      try {
        await notus.unregisterWebhook(ipfsHash)
      } catch (err) {
        errorThrown = true
      }
      assert.isTrue(errorThrown)
    })

    it("Fails if ipfsHash is empty", async () => {
      const ipfsHash = []
      let errorThrown = false;
      try {
        await notus.unregisterWebhook(ipfsHash)
      } catch (err) {
        errorThrown = true
      }
      assert.isTrue(errorThrown)
    })

    it("Succeeds", async () => {
      const ipfsHash = "0xdef456"

      const registerTxn = await notus.registerWebhook(ipfsHash)
      const txn = await notus.unregisterWebhook(ipfsHash)

      const [ firstLog ] = txn.receipt.logs
      assert.equal(firstLog.event, "Unregistered")
      const { owner, ipfsHash: argIpfsHash } = firstLog.args
      assert.equal(owner, accounts[0])
      assert.equal(argIpfsHash, ipfsHash)

      assert.equal(web3.utils.padRight("0x", 40), await notus.owner(ipfsHash))
    })
  })
})
