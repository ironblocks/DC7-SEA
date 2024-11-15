import hre from "hardhat";
import colors from "colors";
import * as fs from "fs/promises";
import { Toolog } from "toolog";

const WAIT_BLOCKS = ["localhost", "local", "hardhat", "anvil"].includes(hre.network.name) ? 1 : 3;
const VENN_CONFIG_FILE = 'venn.config.json';

const logger = new Toolog("Venn-DC7SEA");

async function main() {
    logger.info("Setting Up Firewall");
    logger.warn(` -> Network: ${hre.network.name}`);

    const [sender] = await hre.ethers.getSigners();
    logger.warn(` -> Sender address: ${sender.address}\n`);

    const networkConfig = await loadNetworkConfig();
    const firewallAddress = networkConfig.networks[hre.network.name].firewall;
    
    for (const [contract, address] of Object.entries(networkConfig.networks[hre.network.name].contracts)) {
        logger.info(` -> Setting up ${colors.cyan(contract)} at address ${colors.cyan(address as string)}`);

        const firewallConsumerMinimalABI = ['function setFirewall(address)', 'function setAttestationCenterProxy(address)'];
        const firewallConsumer = new hre.ethers.Contract(address as string, firewallConsumerMinimalABI, sender);

        const setFirewallTx = await firewallConsumer.setFirewall(firewallAddress);
        const setFirewallReceipt = await setFirewallTx.wait(WAIT_BLOCKS);
        logger.warn(` -> Transaction #1 hash: ${colors.cyan(setFirewallReceipt.hash)}`);

        const setAttestationCenterProxyTx = await firewallConsumer.setAttestationCenterProxy(firewallAddress);
        const setAttestationCenterProxyReceipt = await setAttestationCenterProxyTx.wait(WAIT_BLOCKS);
        logger.warn(` -> Transaction #2 hash: ${colors.cyan(setAttestationCenterProxyReceipt.hash)}`);
        logger.ok();
    }    

    logger.done('All done!');
}

async function loadNetworkConfig() {
    try {
        const config = JSON.parse(
            await fs.readFile(VENN_CONFIG_FILE, 'utf-8')
        );

        if (!config.networks[hre.network.name]) {
            logger.error(` -> Network ${hre.network.name} not found in ${VENN_CONFIG_FILE} (quitting)`);
            process.exit(1);
        }

        if (!config.networks[hre.network.name].firewall) {
            logger.error(` -> Firewall not found for network ${hre.network.name} in ${VENN_CONFIG_FILE} (quitting)`);
            process.exit(1);
        }

        if (Object.keys(config.networks[hre.network.name].contracts).length === 0) {
            logger.error(` -> No contracts found for network ${hre.network.name} in ${VENN_CONFIG_FILE} (quitting)`);
            process.exit(1);
        }

        return config;
    } catch (error) {
        logger.error(` -> Failed to load ${VENN_CONFIG_FILE} (quitting)`);
        process.exit(1);
    }
}

main().catch(console.error);