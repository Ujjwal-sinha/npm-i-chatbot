import { ethers } from 'ethers';
import fetch from 'node-fetch';

export const POST = async (req) => {
  try {
    const { amount, address } = await req.json();
    console.log(`ETH Amount: ${amount}; Address: ${address}`);

    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=defichain&vs_currencies=eth');
    const data = await response.json();
    const ethPriceInDfi = 1 / data.defichain.eth;

    const dfiAmount = amount * ethPriceInDfi;
    console.log(`DFI Amount: ${dfiAmount}`);

    const customNetwork = {
      name: 'Metachain Testnet',
      chainId: 1131,
    };

    const provider = new ethers.JsonRpcProvider('https://dmc.mydefichain.com/testnet', customNetwork);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const tx = await wallet.sendTransaction({
      to: address,
      value: ethers.parseEther(dfiAmount.toString()),
    });
    console.log(`Transaction: ${tx.hash}`);

    return new Response(JSON.stringify({ success: true, hash: tx.hash }), {
      status: 200,
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
    });
  }
}
