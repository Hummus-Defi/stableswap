// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

/// @title IPriceOracleGetter interface
interface IPriceOracleGetter {
    /// @dev returns the asset price in ETH
    function getAssetPrice(address _asset) external view returns (uint256);

    /// @dev returns the reciprocal of asset price
    function getAssetPriceReciprocal(address _asset) external view returns (uint256);
}