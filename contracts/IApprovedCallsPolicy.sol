// SPDX-License-Identifier: UNLICENSED
// See LICENSE file for full license text.
// Copyright (c) Ironblocks 2024
pragma solidity ^0.8.0;

interface IApprovedCallsPolicy {
    function approveCallsViaSignature(
        bytes32[] calldata _callHashes,
        uint256 expiration,
        address txOrigin,
        uint256 nonce,
        bytes memory signature
    ) external;
}
