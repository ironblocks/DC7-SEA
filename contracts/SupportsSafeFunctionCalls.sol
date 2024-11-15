// SPDX-License-Identifier: UNLICENSED
// See LICENSE file for full license text.
// Copyright (c) Ironblocks 2024
pragma solidity ^0.8.0;

import {IApprovedCallsPolicy} from "./IApprovedCallsPolicy.sol";

contract SupportsSafeFunctionCalls {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual returns (bool) {
        return interfaceId == type(IApprovedCallsPolicy).interfaceId;
    }
}
