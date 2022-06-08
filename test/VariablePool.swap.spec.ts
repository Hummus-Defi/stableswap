import { ethers } from 'hardhat'
import { parseEther, parseUnits } from '@ethersproject/units'
import chai from 'chai'
import { solidity } from 'ethereum-waffle'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ContractFactory } from 'ethers'
import {
  setupPoolVariable,
  createAndInitializeToken,
  fundUserAndApprovePool,
  setPriceOracle,
  expectAssetValues,
  usdc,
  setupAggregateAccount,
} from './helpers/helper'

const { expect } = chai
chai.use(solidity)

describe('PoolVariable', function () {
  let owner: SignerWithAddress
  let users: SignerWithAddress[]
  let TestERC20: ContractFactory

  before(async () => {
    const [first, ...rest] = await ethers.getSigners()
    owner = first
    users = rest

    TestERC20 = await ethers.getContractFactory('TestERC20')
  })

  beforeEach(async function () {
    //const TestWAVAX = await ethers.getContractFactory('TestWAVAX')

    this.lastBlock = await ethers.provider.getBlock('latest')
    this.lastBlockTime = this.lastBlock.timestamp
    this.fiveSecondsSince = this.lastBlockTime + 5 * 1000
    this.fiveSecondsAgo = this.lastBlockTime - 5 * 1000

    const poolSetup = await setupPoolVariable(owner)
    this.pool = poolSetup.pool
    //this.WETH = await TestWAVAX.deploy()
  })

  describe('Asset USDC (6 decimals), METIS (18 decimals), ETH (18 decimals)', function () {
    beforeEach(async function () {
      // Setup aggregate account
      const aggregateName = '3pool'
      const aggregateAccount = await setupAggregateAccount(owner, aggregateName, true)
      await aggregateAccount.deployTransaction.wait()

      const tokenSetMetis = await createAndInitializeToken('METIS', 18, owner, this.pool, aggregateAccount)
      const tokenSetUSDC = await createAndInitializeToken('USDC', 6, owner, this.pool, aggregateAccount)
      const tokenSetETH = await createAndInitializeToken('ETH', 18, owner, this.pool, aggregateAccount)

      this.METIS = tokenSetMetis.token
      this.assetMETIS = tokenSetMetis.asset

      this.USDC = tokenSetUSDC.token
      this.assetUSDC = tokenSetUSDC.asset

      this.ETH = tokenSetETH.token
      this.assetETH = tokenSetETH.asset

      // Set price oracle
      await setPriceOracle(this.pool, owner, this.lastBlockTime, [
        { address: this.assetMETIS.address, initialRate: parseUnits('20', 8).toString() },
        { address: this.assetUSDC.address, initialRate: parseUnits('1', 8).toString() },
        { address: this.assetETH.address, initialRate: parseUnits('2000', 8).toString() },
      ])

      // fund user with 100 k
      await fundUserAndApprovePool(this.METIS, users[0], parseEther('100000').toString(), this.pool, owner)
      await fundUserAndApprovePool(this.USDC, users[0], usdc('100000').toString(), this.pool, owner)
      await fundUserAndApprovePool(this.ETH, users[0], parseEther('100000').toString(), this.pool, owner)

      // deposit 1 k metis
      await this.pool
        .connect(users[0])
        .deposit(this.METIS.address, parseEther('1000'), users[0].address, this.fiveSecondsSince)
      // deposit 20 k usdc
      await this.pool
        .connect(users[0])
        .deposit(this.USDC.address, usdc('20000'), users[0].address, this.fiveSecondsSince)
      // deposit 10 eth
      await this.pool
        .connect(users[0])
        .deposit(this.ETH.address, parseEther('10'), users[0].address, this.fiveSecondsSince)
    })

    describe('swap', function () {
      it('works (METIS -> USDC)', async function () {
        const beforeFromBalance = await this.METIS.balanceOf(users[0].address)
        const beforeToBalance = await this.USDC.balanceOf(users[0].address)

        const [quotedAmount] = await this.pool
          .connect(users[0])
          .quotePotentialSwap(this.METIS.address, this.USDC.address, parseEther('100'))

        const receipt = await this.pool.connect(users[0]).swap(
          this.METIS.address,
          this.USDC.address,
          parseEther('100'),
          Math.floor(quotedAmount * 0.9) + '', //expect at least 90% of ideal quoted amount
          users[0].address,
          this.fiveSecondsSince
        )
        const afterFromBalance = await this.METIS.balanceOf(users[0].address)
        const afterToBalance = await this.USDC.balanceOf(users[0].address)

        const tokenSent = afterFromBalance.sub(beforeFromBalance)
        const tokenGot = afterToBalance.sub(beforeToBalance)

        expect(tokenSent).to.be.equal(parseEther('-100'))
        expect(tokenGot).to.be.equal(usdc('1999.158508'))

        // check if quoted amount is the same to actual amount of token got
        expect(tokenGot).to.be.equal(quotedAmount)

        await expectAssetValues(this.assetMETIS, 18, { cash: '1100', liability: '1000' })
        await expectAssetValues(this.assetUSDC, 6, { cash: '18000.841492', liability: '20000' })

        expect(receipt)
          .to.emit(this.pool, 'Swap')
          .withArgs(
            users[0].address,
            this.METIS.address,
            this.USDC.address,
            parseEther('100'),
            usdc('1999.158508'),
            users[0].address
          )

        expect(tokenSent.add(await this.assetMETIS.cash())).to.be.equal(parseEther('1000'))
        expect(tokenGot.add(await this.assetUSDC.cash())).to.be.equal(usdc('20000'))
      })

      it('works (USDC -> ETH)', async function () {
        const beforeFromBalance = await this.USDC.balanceOf(users[0].address)
        const beforeToBalance = await this.ETH.balanceOf(users[0].address)

        const [quotedAmount] = await this.pool
          .connect(users[0])
          .quotePotentialSwap(this.USDC.address, this.ETH.address, usdc('100'))

        const receipt = await this.pool.connect(users[0]).swap(
          this.USDC.address,
          this.ETH.address,
          usdc('100'),
          Math.floor(quotedAmount * 0.9) + '', //expect at least 90% of ideal quoted amount
          users[0].address,
          this.fiveSecondsSince
        )
        const afterFromBalance = await this.USDC.balanceOf(users[0].address)
        const afterToBalance = await this.ETH.balanceOf(users[0].address)

        const tokenSent = afterFromBalance.sub(beforeFromBalance)
        const tokenGot = afterToBalance.sub(beforeToBalance)

        expect(tokenSent).to.be.equal(usdc('-100'))
        expect(tokenGot).to.be.equal(parseEther('0.049984720031509982'))

        await expectAssetValues(this.assetUSDC, 6, { cash: '20100', liability: '20000' })

        //check if token got is equal to token quoted
        expect(tokenGot).to.be.equal(quotedAmount)
        await expectAssetValues(this.assetETH, 18, {
          cash: '9.950015279968490018',
          liability: '10',
        })

        expect(receipt)
          .to.emit(this.pool, 'Swap')
          .withArgs(
            users[0].address,
            this.USDC.address,
            this.ETH.address,
            usdc('100'),
            parseEther('0.049984720031509982'),
            users[0].address
          )

        expect(tokenSent.add(await this.assetUSDC.cash())).to.be.equal(usdc('20000'))
        expect(tokenGot.add(await this.assetETH.cash())).to.be.equal(parseEther('10'))
      })

      it('works (ETH -> METIS)', async function () {
        const beforeFromBalance = await this.ETH.balanceOf(users[0].address)
        const beforeToBalance = await this.METIS.balanceOf(users[0].address)

        const [quotedAmount] = await this.pool
          .connect(users[0])
          .quotePotentialSwap(this.ETH.address, this.METIS.address, parseEther('1'))

        const receipt = await this.pool.connect(users[0]).swap(
          this.ETH.address,
          this.METIS.address,
          parseEther('1'),
          Math.floor(quotedAmount * 0.9) + '', //expect at least 90% of ideal quoted amount
          users[0].address,
          this.fiveSecondsSince
        )
        const afterFromBalance = await this.ETH.balanceOf(users[0].address)
        const afterToBalance = await this.METIS.balanceOf(users[0].address)

        const tokenSent = afterFromBalance.sub(beforeFromBalance)
        const tokenGot = afterToBalance.sub(beforeToBalance)

        expect(tokenSent).to.be.equal(parseEther('-1'))
        expect(tokenGot).to.be.equal(parseEther('99.95792542946782911'))

        await expectAssetValues(this.assetETH, 18, { cash: '11', liability: '10' })

        //check if token got is equal to token quoted
        expect(tokenGot).to.be.equal(quotedAmount)
        await expectAssetValues(this.assetMETIS, 18, {
          cash: '900.042074570532170890',
          liability: '1000',
        })

        expect(receipt)
          .to.emit(this.pool, 'Swap')
          .withArgs(
            users[0].address,
            this.ETH.address,
            this.METIS.address,
            parseEther('1'),
            parseEther('99.95792542946782911'),
            users[0].address
          )

        expect(tokenSent.add(await this.assetETH.cash())).to.be.equal(parseEther('10'))
        expect(tokenGot.add(await this.assetMETIS.cash())).to.be.equal(parseEther('1000'))
      })

      it('Rewards actions that move METIS (rci) and USDC (rcj) closer', async function () {
        // // Check current cash position of asset

        // First, adjust coverage ratio of first asset Si Metis to 0.5
        await this.assetMETIS.connect(owner).setPool(owner.address)
        await this.assetMETIS.connect(owner).removeCash(parseEther('500')) // remove 500 from asset cash
        await this.assetMETIS.connect(owner).transferUnderlyingToken(owner.address, parseEther('500'))
        await this.assetMETIS.connect(owner).setPool(this.pool.address)
        expect((await this.assetMETIS.cash()) / (await this.assetMETIS.liability())).to.equal(0.5) // Rci = 0.5

        // Second, check coverage ratio of second asset USDC is still 1
        expect((await this.assetUSDC.cash()) / (await this.assetUSDC.liability())).to.equal(1) // Rcj = 1

        // In this case, Rci < Rcj which implies Si < Sj, which in turns implies Si - Sj < 0
        // Meaning the system will reward this transaction since fee is : 1 - (Si - Sj) > 1

        const beforeBalanceMETIS = await this.METIS.balanceOf(users[0].address)
        const beforeBalanceUSDC = await this.USDC.balanceOf(users[0].address)

        const [quotedAmount] = await this.pool
          .connect(users[0])
          .quotePotentialSwap(this.METIS.address, this.USDC.address, parseEther('100'))

        await this.pool.connect(users[0]).swap(
          this.METIS.address,
          this.USDC.address,
          parseEther('100'),
          Math.floor(quotedAmount * 0.9) + '', //expect at least 90% of ideal quoted amount
          users[0].address,
          this.fiveSecondsSince
        )

        const afterBalanceMETIS = await this.METIS.balanceOf(users[0].address)
        const afterBalanceUSDC = await this.USDC.balanceOf(users[0].address)

        const METISDeltaAmount = afterBalanceMETIS.sub(beforeBalanceMETIS)
        const USDCDeltaAmount = afterBalanceUSDC.sub(beforeBalanceUSDC)

        expect(USDCDeltaAmount).to.be.equal(quotedAmount)

        // arbitrageDelta amount lost or won by trade. 1 METIS = 20 USDC
        const arbitrageDelta =
          parseInt(ethers.utils.formatUnits(USDCDeltaAmount, 6)) + 20 * parseInt(ethers.utils.formatEther(METISDeltaAmount))

        expect(arbitrageDelta).to.be.above(0)
      })

      it('Penalize actions that move METIS (rci) and USDC (rcj) further away', async function () {
        // First, check coverage ratio of first asset METIS is still 1
        expect((await this.assetMETIS.cash()) / (await this.assetMETIS.liability())).to.equal(1) // Rci = 1

        // Second, adjust coverage ratio of second asset Sj USDC to 0.5
        await this.assetUSDC.connect(owner).setPool(owner.address)
        await this.assetUSDC.connect(owner).removeCash(usdc('10000')) // remove 10k from asset cash
        await this.assetUSDC.connect(owner).transferUnderlyingToken(owner.address, usdc('10000'))
        await this.assetUSDC.connect(owner).setPool(this.pool.address)
        expect((await this.assetUSDC.cash()) / (await this.assetUSDC.liability())).to.equal(0.5) // Rcj = 0.5

        // In this case, Rci > Rcj (1 > 0.5) which implies Si > Sj, which in turns implies Si - Sj > 0
        // Meaning the system will penalize this transaction since fee is : 1 - (Si - Sj) < 1

        const beforeBalanceMETIS = await this.METIS.balanceOf(users[0].address)
        const beforeBalanceUSDC = await this.USDC.balanceOf(users[0].address)

        const [quotedAmount] = await this.pool
          .connect(users[0])
          .quotePotentialSwap(this.METIS.address, this.USDC.address, parseEther('100'))

        await this.pool.connect(users[0]).swap(
          this.METIS.address,
          this.USDC.address,
          parseEther('100'),
          Math.floor(quotedAmount * 0.9) + '', //expect at least 90% of ideal quoted amount
          users[0].address,
          this.fiveSecondsSince
        )

        const afterBalanceMETIS = await this.METIS.balanceOf(users[0].address)
        const afterBalanceUSDC = await this.USDC.balanceOf(users[0].address)

        const METISDeltaAmount = afterBalanceMETIS.sub(beforeBalanceMETIS)
        const USDCDeltaAmount = afterBalanceUSDC.sub(beforeBalanceUSDC)

        // Check that expected amount is the same as quoted
        expect(USDCDeltaAmount).to.be.equal(quotedAmount)

        // arbitrageDelta amount lost or won by trade. 1 METIS = 20 USDC
        const arbitrageDelta =
          parseInt(ethers.utils.formatUnits(USDCDeltaAmount, 6)) + 20 * parseInt(ethers.utils.formatEther(METISDeltaAmount))

        expect(arbitrageDelta).to.be.below(0)
      })

      it('revert if assets are in 2 different aggregate pools', async function () {
        const aggregateAccount2 = await setupAggregateAccount(owner, 'LINK', false)
        await aggregateAccount2.deployTransaction.wait()

        const tokenSetLINK = await createAndInitializeToken('LINK', 18, owner, this.pool, aggregateAccount2)

        this.LINK = tokenSetLINK.token
        this.assetLINK = tokenSetLINK.asset

        // await this.assetETH.connect(owner).initialize()
        await expect(
          this.pool
            .connect(users[0])
            .swap(this.USDC.address, this.LINK.address, usdc('1'), usdc('0'), users[0].address, this.fiveSecondsSince)
        ).to.be.revertedWith('DIFF_AGG_ACC')
      })

      it('allows swapping when cov = 0', async function () {
        // Adjust coverage ratio to 0
        await this.assetUSDC.connect(owner).setPool(owner.address)
        await this.assetUSDC.connect(owner).transferUnderlyingToken(owner.address, await this.assetUSDC.cash())
        await this.assetUSDC.connect(owner).removeCash(await this.assetUSDC.cash())
        await this.assetUSDC.connect(owner).setPool(this.pool.address)
        expect((await this.assetUSDC.cash()) / (await this.assetUSDC.liability())).to.equal(0)

        const beforeFromBalance = await this.USDC.balanceOf(users[0].address)
        const beforeToBalance = await this.ETH.balanceOf(users[0].address)

        const [quotedAmount] = await this.pool
          .connect(users[0])
          .quotePotentialSwap(this.USDC.address, this.ETH.address, usdc('100'))

        const receipt = await this.pool.connect(users[0]).swap(
          this.USDC.address,
          this.ETH.address,
          usdc('100'),
          Math.floor(quotedAmount * 0.9) + '', //expect at least 90% of ideal quoted amount
          users[0].address,
          this.fiveSecondsSince
        )
        const afterFromBalance = await this.USDC.balanceOf(users[0].address)
        const afterToBalance = await this.ETH.balanceOf(users[0].address)

        const tokenSent = afterFromBalance.sub(beforeFromBalance)
        const tokenGot = afterToBalance.sub(beforeToBalance)

        expect(tokenSent).to.be.equal(usdc('-100'))
        expect(tokenGot).to.be.equal(parseEther('0.099962860016096302'))

        await expectAssetValues(this.assetUSDC, 6, { cash: '100', liability: '20000' })

        //check if token got is equal to token quoted
        expect(tokenGot).to.be.equal(quotedAmount)
        await expectAssetValues(this.assetETH, 18, {
          cash: '9.900037139983903698',
          liability: '10',
        })

        expect(receipt)
          .to.emit(this.pool, 'Swap')
          .withArgs(
            users[0].address,
            this.USDC.address,
            this.ETH.address,
            usdc('100'),
            parseEther('0.099962860016096302'),
            users[0].address
          )
      })

      it('allows swapping then withdrawing', async function () {
        // Approve spending by pool
        await this.assetMETIS.connect(users[0]).approve(this.pool.address, ethers.constants.MaxUint256)
        await this.assetUSDC.connect(users[0]).approve(this.pool.address, ethers.constants.MaxUint256)

        // Swap 100 METIS to USDC
        const swapReceipt = await this.pool.connect(users[0]).swap(
          this.METIS.address,
          this.USDC.address,
          parseEther('100'),
          usdc('1800'), //expect at least 90% of ideal quoted amount
          users[0].address,
          this.fiveSecondsSince
        )

        expect(swapReceipt)
          .to.emit(this.pool, 'Swap')
          .withArgs(
            users[0].address,
            this.METIS.address,
            this.USDC.address,
            parseEther('100'),
            usdc('1999.158508'),
            users[0].address
          )

        // Then try to withdraw 1000 USDC
        const withdrawalReceipt = await this.pool
          .connect(users[0])
          .withdraw(this.USDC.address, usdc('1000'), usdc('999'), users[0].address, this.fiveSecondsSince)

        expect(withdrawalReceipt)
          .to.emit(this.pool, 'Withdraw')
          .withArgs(users[0].address, this.USDC.address, usdc('999.988531'), usdc('1000'), users[0].address)
      })

      it('reverts if passed deadline', async function () {
        await expect(
          this.pool.connect(users[0]).swap(
            this.USDC.address,
            this.ETH.address,
            usdc('100'),
            0,
            users[0].address,
            this.fiveSecondsAgo
          )
        ).to.be.revertedWith('EXPIRED')
      })

      it('reverts if amount to receive is less than expected', async function () {
        await expect(
          this.pool.connect(users[0]).swap(
            this.USDC.address,
            this.ETH.address,
            usdc('100'),
            parseEther('100'), //expect at least 100% of ideal quoted amount
            users[0].address,
            this.fiveSecondsSince
          )
        ).to.be.revertedWith('AMOUNT_TOO_LOW')
      })

      it('reverts if pool paused', async function () {
        await this.pool.connect(owner).pause()
        await expect(
          this.pool.connect(users[0]).swap(
            this.USDC.address,
            this.ETH.address,
            usdc('100'),
            parseEther('90'), //expect at least 90% of ideal quoted amount
            users[0].address,
            this.fiveSecondsSince
          )
        ).to.be.revertedWith('Pausable: paused')
      })

      it('reverts if zero address provided', async function () {
        await expect(
          this.pool.connect(users[0]).swap(
            ethers.constants.AddressZero,
            this.METIS.address,
            usdc('100'),
            parseEther('90'), //expect at least 90% of ideal quoted amount
            users[0].address,
            this.fiveSecondsSince
          )
        ).to.be.revertedWith('ZERO')

        await expect(
          this.pool.connect(users[0]).swap(
            this.USDC.address,
            ethers.constants.AddressZero,
            usdc('100'),
            parseEther('90'), //expect at least 90% of ideal quoted amount
            users[0].address,
            this.fiveSecondsSince
          )
        ).to.be.revertedWith('ZERO')
      })

      it('reverts if asset not exist', async function () {
        const pax = await TestERC20.connect(owner).deploy('PAX', 'PAX', 18, '0')
        await expect(
          this.pool
            .connect(users[0])
            .swap(pax.address, this.USDC.address, parseEther('10'), usdc('0'), users[0].address, this.fiveSecondsSince)
        ).to.be.revertedWith('ASSET_NOT_EXIST')
      })

      it('reverts if user does not have enough from tokens', async function () {
        await expect(
          this.pool.connect(users[3]).swap(
            this.USDC.address,
            this.METIS.address,
            usdc('100'),
            parseEther('0'), //expect at least 90% of ideal quoted amount
            users[3].address,
            this.fiveSecondsSince
          )
        ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
      })

    })
  })

  /*
  describe("USDC -> DAI newton's method check", function () {
    beforeEach(async function () {
      // Setup aggregate account
      const aggregateName = 'USD-Stablecoins'
      const aggregateAccount = await setupAggregateAccount(owner, aggregateName, true)
      await aggregateAccount.deployTransaction.wait()

      const tokenSetDAI = await createAndInitializeToken('DAI', 18, owner, this.pool, aggregateAccount)
      const tokenSetUSDC = await createAndInitializeToken('USDC', 6, owner, this.pool, aggregateAccount)

      this.DAI = tokenSetDAI.token
      this.assetDAI = tokenSetDAI.asset

      this.USDC = tokenSetUSDC.token
      this.assetUSDC = tokenSetUSDC.asset
      await setPriceOracle(this.pool, owner, this.lastBlockTime, [
        { address: this.DAI.address, initialRate: parseEther('1').toString() },
        { address: this.USDC.address, initialRate: parseEther('1').toString() },
      ])

      // fund user with 100 k
      await fundUserAndApprovePool(this.DAI, users[0], parseEther('100000').toString(), this.pool, owner)
      await fundUserAndApprovePool(this.USDC, users[0], usdc('100000').toString(), this.pool, owner)

      // deposit 30 k dai
      await this.pool
        .connect(users[0])
        .deposit(this.DAI.address, parseEther('30000'), users[0].address, this.fiveSecondsSince)
      // deposit 30 k usdc
      await this.pool
        .connect(users[0])
        .deposit(this.USDC.address, usdc('30000'), users[0].address, this.fiveSecondsSince)

      // Set assets and liabilities
      await this.assetUSDC.connect(owner).setPool(owner.address)
      await this.assetDAI.connect(owner).setPool(owner.address)

      // [assets to remove, liabilities to remove]
      const deltaUsdc = [parseUnits('1501.9924', 6), parseUnits('1499.9936', 6)]
      const deltaDai = [parseUnits('24332.94831', 18), parseUnits('14584.7767', 18)]

      /// USDC
      await this.assetUSDC.connect(owner).removeCash(deltaUsdc[0])
      await this.assetUSDC.connect(owner).transferUnderlyingToken(owner.address, deltaUsdc[0])
      await this.assetUSDC.connect(owner).removeLiability(deltaUsdc[1])
      await this.assetUSDC.connect(owner).setPool(this.pool.address)

      /// DAI
      await this.assetDAI.connect(owner).removeCash(deltaDai[0])
      await this.assetDAI.connect(owner).removeLiability(deltaDai[1])
      await this.assetDAI.connect(owner).transferUnderlyingToken(owner.address, deltaDai[0])
      await this.assetDAI.connect(owner).setPool(this.pool.address)

      // finally, check asset values are what we need them to be for simulation
      await expectAssetValues(this.assetDAI, 18, { cash: '5667.05169', liability: '15415.2233' })
      await expectAssetValues(this.assetUSDC, 6, { cash: '28498.0076', liability: '28500.0064' })

      const desiredUSDCCov = 0.9999298666824159
      expect((await this.assetUSDC.cash()) / (await this.assetUSDC.liability())).to.equal(desiredUSDCCov)

      const desiredDAICov = 0.36762696068113393
      expect((await this.assetDAI.cash()) / (await this.assetDAI.liability())).to.equal(desiredDAICov)
    })

    it("should get correct quoteFromAmount (newton's method check)", async function () {
      // Now swap using simulation values
      // To = 320
      // From = 684,4058421986970000000000
      const beforeFromBalance = await this.USDC.balanceOf(users[0].address)
      const beforeToBalance = await this.DAI.balanceOf(users[0].address)

      const [quotedAmount] = await this.pool
        .connect(users[0])
        .quotePotentialSwap(this.USDC.address, this.DAI.address, usdc('684.405842'))

      await this.pool
        .connect(users[0])
        .swap(
          this.USDC.address,
          this.DAI.address,
          usdc('684.405842'),
          parseEther('0'),
          users[0].address,
          this.fiveSecondsSince
        )
      // console.log(formatEther(quotedAmount))

      const afterFromBalance = await this.USDC.balanceOf(users[0].address)
      const afterToBalance = await this.DAI.balanceOf(users[0].address)
      const tokenSent = afterFromBalance.sub(beforeFromBalance)
      const tokenGot = afterToBalance.sub(beforeToBalance)
      expect(tokenGot).to.be.equal(quotedAmount)
      expect(tokenSent).to.be.equal(-usdc('684.405842'))
      expect(tokenGot).to.be.equal('196.362765707548924211')
    })
  })
  */
})
