# DC7SEA Venn Challenge

Hi and welcome to the Venn Challenge for DC7SEA 👋

Venn Network is an advanced security layer that you can easily add on top of your smart contracts.

- Learn more at: [Venn Site](https://www.venn.build) |  [Venn Playground](https://playground.venn.build)

## Instructions

In this challenge, you'll deploy a new Venn Firewall and integrate it into your smart contracts to enhance your project's security.

Once completed, you'll also need to integrate Venn DApp SDK to your DApp's Frontend so that transactions get approved before being sent onchain.

Ready ?  Let's go 💪

<br /><br />

### Step 1: In This Repo

1. Clone the repo and install dependencies:

```shell
git clone https://github.com/ironblocks/DC7-SEA
npm ci
```

2. Setup your private key and hardhat network configuration

```
cp .env.example .env
```

```shell
PRIVATE_KEY=...
RPC_URL=...
```

3. Compile

```shell
npm run firewall:compile  # the warning are a feature, not a bug 😅
```

4. Deploy a new Firewall

    Venn Firewall is an onchain solution that can surgically prevent malicious transactions from going through, only allowing approved transactions to be executed.

```shell
npm run firewall:deploy -- --network <network>
```

5. Note the new `venn.config.json` file that was created with the Firewall address in it. We'll use this later in **Step 4**.

<br /><br />

### Step 2: In Your Smart Contracts Repo

Now that the Firewall is deployed, you'll use various Venn SDKs to integrate Venn with your project.

1. Install the CLI:

```shell
npm i -g @vennbuild/cli
```

2. Run the CLI to add the Firewall to your smart contracts:

```shell
venn fw integ -r -d contracts
```

3. Deploy your contracts as you normally would:

```shell
hardhat run scripts/deploy.js   # your deployment script
```

<br /><br />

### Step 3: Back In This Repo

Now that your smart contracts have integration with Venn, you'll need to send a setup transaction to enable the Firewall.

1. Remember `venn.config.json` ?  time to use it.
Open this file and add your contracts addresses:

```json
{
    "networks": {
        "holesky": {
            "firewall": "0x123...",

            "contracts": {
                "MyContract1": "0x11111...",
                "MyContract2": "0x22222..."
            }
        }
    }
}
```

2. Run the setup script. This script will send setup transactions from the `PRIVATE_KEY` you've configured in the `.env` file to turn on the Firewall on each of your contracts:

```shell
npm run firewall:setup -- --network <network>
```

<br /><br />

### Step 4: Your Repo Again (last time i promise!)

With the Venn Firewall enabled on your smart contracts, transactions need to be approved via Venn Network before they can be submitted on chain.

To do this, you'll add our Venn DApp SDK to your DApp's Frontend.

1. Install the SDK

```shell
npm i @vennbuild/venn-dapp-sdk
```

2. Create a new instance of the SDK Client

```typescript
import { VennClient } from '@vennbuild/venn-dapp-sdk';

const vennURL           = "https://dc7sea.venn.build/sign";
const vennPolicyAddress = YOUR FIREWALL ADDRESS;

const vennClient = new VennClient({ vennURL, vennPolicyAddress });
```

3. Update your DApp to approve transactions before submitting them onchain:

```typescript
// You probably have something like this:
const tx = { to, from, data, value };
const receipt = await wallet.sendTransaction(approvedTransaction);


// But now you need this:
const tx = { to, from, data, value };
const approvedTransaction = await vennClient.approve(tx);
const receipt = await wallet.sendTransaction(approvedTransaction);
```

<br /><br />

### Removing The Firewall

Easy. Just run this:

```shell
npm run firewall:remove -- --network <network>
```

<br /><br />

## Happy Hunting 😎

<br /><br />
