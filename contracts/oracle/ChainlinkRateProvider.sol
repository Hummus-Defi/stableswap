// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';
import '@chainlink/contracts/src/v0.8/interfaces/FeedRegistryInterface.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

import '../interfaces/IRateProvider.sol';

/**
 * @title Chainlink Rate Provider for use with Balancer AMM
 * @notice Returns a Chainlink price feed's quote for the provided currency pair
 */
contract ChainlinkRateProvider is IRateProvider {
    AggregatorV3Interface public immutable pricefeed;

    // Rate providers are expected to respond with a fixed-point value with 18 decimals
    // We then need to scale the price feed's output to match this.
    uint256 internal immutable _scalingFactor;

    /**
     * @param feed - The Chainlink price feed contract
     */
    constructor(AggregatorV3Interface feed) {
        pricefeed = feed;
        _scalingFactor = 10 ** SafeMath.sub(18, feed.decimals());
    }

    /**
     * @return the value of the quote currency in terms of the base currency
     */
    function getRate() external view override returns (uint256) {
        (uint80 roundId, int256 price, , uint256 updated, ) = pricefeed.latestRoundData();
        require(price > 0, 'Invalid price rate response');
        require(block.timestamp - updated < 86_400, 'Stale price rate response');
        (, int256 lastPrice, , , ) = pricefeed.getRoundData(roundId - 1);
        require(price > (lastPrice * 95) / 100 && price < (lastPrice * 105) / 100, 'Price rate deviation too large');
        return uint256(price) * _scalingFactor;
    }
}
