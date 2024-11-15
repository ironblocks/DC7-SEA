import hre from "hardhat";
import colors from "colors";
import * as fs from "fs/promises";
import { Toolog } from "toolog";

const WAIT_BLOCKS = ["localhost", "local", "hardhat", "anvil"].includes(hre.network.name) ? 1 : 3;
const VENN_CONFIG_FILE = 'venn.config.json';

const logger = new Toolog("Venn-DC7SEA");

async function main() {
    logger.info("Deploying Firewall");
    logger.warn(` -> Network: ${hre.network.name}`);

    const [sender] = await hre.ethers.getSigners();
    logger.warn(` -> Sender address: ${sender.address}\n`);

    const DC7SEAFirewall = await hre.ethers.getContractFactory("DC7SEAFirewall");
    const dc7seaFirewall = await DC7SEAFirewall.deploy();
    const deploymentTransaction = dc7seaFirewall.deploymentTransaction() as any;
    const deploymentReceipt = await deploymentTransaction.wait(WAIT_BLOCKS);
    const dc7seaFirewallAddress = await dc7seaFirewall.getAddress();
    
    logger.warn(` -> DC7SEAFirewall address: ${colors.cyan(dc7seaFirewallAddress)}`);
    logger.warn(` -> Transaction hash: ${deploymentReceipt.hash}\n`);
    
    logger.warn(' -> Writing DC7SEAFirewall address to venn.config.json');
    await writeFirewallAddressToConfigFile(dc7seaFirewallAddress);
    
    logger.ok();
}

async function writeFirewallAddressToConfigFile(address: string) {
    let config: any = {};
    try {
        config = JSON.parse(
            await fs.readFile(VENN_CONFIG_FILE, 'utf-8')
        );
    } catch (error) {}

    config.networks = config.networks || {};
    config.networks[hre.network.name] = config.networks[hre.network.name] || {};
    config.networks[hre.network.name].firewall = address;

    await fs.writeFile(VENN_CONFIG_FILE, JSON.stringify(config, null, 2));
}

main().catch(console.error);