// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import '../libraries/DSMath.sol';
import '../interfaces/IDIAOracle.sol';
import '../interfaces/IPriceOracleGetter.sol';

/// @title DiaProxyPriceProvider

/// @notice Proxy smart contract to get the price of an asset from a price source, with DIA Key-Value Oracle
///         smart contracts as primary option
///         https://docs.diadata.org/documentation/oracle-documentation/access-the-oracle#dia-key-value-oracle-contract
/// - Asset feeds must be 8 decimal precision
/// - If the returned price by a DIA oracle is <= 0, the transaction will be reverted
/// - Can be owned by the governance system, allowed to add sources for assets, replace them
contract DiaProxyPriceProvider is IPriceOracleGetter, Ownable {
    using DSMath for uint256;

    event AssetSourceUpdated(address indexed asset, address indexed source, string indexed key);

    mapping(address => string) private _assetKeys;
    mapping(address => IDIAOracle) private _assetsSources;

    /// @notice Constructor
    /// @param assets The addresses of the assets
    /// @param sources The address of the source of each asset
    /// @param keys The strings of the asset keys
    constructor(
        address[] memory assets,
        address[] memory sources,
        string[] memory keys
    ) {
        internalSetAssetsSources(assets, sources, keys);
    }

    /// @notice External function called by the owner to set or replace sources of assets
    /// @param assets The addresses of the assets
    /// @param sources The address of the source of each asset
    /// @param keys The strings of the asset keys
    function setAssetSources(
        address[] calldata assets,
        address[] calldata sources,
        string[] calldata keys
    ) external onlyOwner {
        internalSetAssetsSources(assets, sources, keys);
    }

    /// @notice Internal function to set the sources for each asset
    /// @param assets The addresses of the assets
    /// @param sources The address of the source of each asset
    /// @param keys The strings of the asset keys
    function internalSetAssetsSources(
        address[] memory assets,
        address[] memory sources,
        string[] memory keys
    ) internal {
        require(assets.length == sources.length, 'INCONSISTENT_PARAMS_LENGTH');
        for (uint256 i; i < assets.length; ++i) {
            _assetKeys[assets[i]] = keys[i];
            _assetsSources[assets[i]] = IDIAOracle(sources[i]);
            emit AssetSourceUpdated(assets[i], sources[i], keys[i]);
        }
    }

    /// @notice Gets an asset price by address
    /// @param asset The asset address
    function getAssetPrice(address asset) public view override returns (uint256) {
        IDIAOracle source = _assetsSources[asset];
        // Require the asset has registered source
        require(address(source) != address(0), 'SOURCE_IS_MISSING');
        (uint128 price, ) = source.getValue(_assetKeys[asset]);
        require(price > 0, 'INVALID_PRICE');
        return uint256(price);
    }

    /// @notice Gets reciprocal of price
    /// @param asset The asset address
    function getAssetPriceReciprocal(address asset) external view override returns (uint256) {
        uint256 assetPrice = getAssetPrice(asset);
        uint256 price = assetPrice.reciprocal();
        require(price > 0, 'INVALID_PRICE');
        return price;
    }

    /// @notice Gets a list of prices from a list of assets addresses
    /// @param assets The list of assets addresses
    function getAssetsPrices(address[] calldata assets) external view returns (uint256[] memory) {
        uint256[] memory prices = new uint256[](assets.length);
        for (uint256 i; i < assets.length; ++i) {
            prices[i] = getAssetPrice(assets[i]);
        }
        return prices;
    }

    /// @notice Gets the address of the source for an asset address
    /// @param asset The address of the asset
    /// @return string The string of the asset key
    function getKeyOfAsset(address asset) external view returns (string memory) {
        return _assetKeys[asset];
    }

    /// @notice Gets the address of the source for an asset address
    /// @param asset The address of the asset
    /// @return address The address of the source
    function getSourceOfAsset(address asset) external view returns (address) {
        return address(_assetsSources[asset]);
    }
}
