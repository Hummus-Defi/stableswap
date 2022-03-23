// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

interface IDIAOracle {
    function values(string memory key) external view returns (uint256);

    function getValue(string memory key) external view returns (uint128 value, uint128 timestamp);
}
