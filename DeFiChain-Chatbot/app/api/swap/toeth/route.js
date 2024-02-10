import { ethers } from 'ethers';
import fetch from 'node-fetch';

export const POST = async (req) => {
  try {
    const { amount, address } = await req.json();
    console.log(`DFI Amount: ${amount}; Address: ${address}`);

    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=defichain&vs_currencies=eth');
    const data = await response.json();
    const dfiPriceInEth = data.defichain.eth;

    const ethAmount = amount * dfiPriceInEth;
    const ethAmountFixed = parseFloat(ethAmount.toFixed(18));
    console.log(`ETH Amount: ${ethAmountFixed}`);

    const provider = new ethers.AlchemyProvider('sepolia', process.env.ALCHEMY_API_KEY);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const tx = await wallet.sendTransaction({
      to: address,
      value: ethers.parseEther(ethAmountFixed.toString()),
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
