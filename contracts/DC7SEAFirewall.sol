// SPDX-License-Identifier: UNLICENSED
// See LICENSE file for full license text.
// Copyright (c) Ironblocks 2024
pragma solidity ^0.8.0;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {SupportsSafeFunctionCalls} from "./SupportsSafeFunctionCalls.sol";

/**
 ONLY FOR DEMONSTRATION PURPOSES - MOCK FOR DEVCON HACKATHON, used to show functionality of the venn-dapp-sdk and firewallConsumer
 */
contract DC7SEAFirewall is AccessControl, SupportsSafeFunctionCalls {
    uint public constant EXPIRATION = 10;
    mapping(address => uint256) public approvedCallers;

    /**
     * @dev   ONLY FOR KINTO HACKATHON - the function is not secured for production
     * @param txOrigin The transaction origin of the approved hashes.
     */
    function approveCalls(address txOrigin) external {
        approvedCallers[txOrigin] = block.number;
    }

    /**
     * @dev Runs the preExecution hook of all subscribed policies.
     * @param sender The address of the caller.
     * @param data The calldata of the call (some firewall modifiers may pass custom data based on the use case)
     * @param value The value of the call.
     */
    function preExecution(
        address sender,
        bytes calldata data,
        uint256 value
    ) external {
        require(
            block.number - approvedCallers[tx.origin] <= EXPIRATION,
            "Firewall: call not approved"
        );
    }

    /**
     * @dev Runs the postExecution hook of all subscribed policies.
     * @param sender The address of the caller.
     * @param data The calldata of the call (some firewall modifiers may pass custom data based on the use case)
     * @param value The value of the call.
     */
    function postExecution(
        address sender,
        bytes calldata data,
        uint256 value
    ) external {}

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(AccessControl, SupportsSafeFunctionCalls)
        returns (bool)
    {
        return
            SupportsSafeFunctionCalls.supportsInterface(interfaceId) ||
            AccessControl.supportsInterface(interfaceId);
    }
}
