// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '../pool/Core.sol';

contract TestSlippage is Core {
    function testSlippage(
        uint256 k,
        uint256 n,
        uint256 c1,
        uint256 xThreshold,
        uint256 x
    ) external pure returns (uint256) {
        return _slippageFunc(k, n, c1, xThreshold, x);
    }
}