import OpenAI from "openai";
import fs from 'fs';

const openai = new OpenAI();

const documentation = await openai.files.create({
  file: fs.createReadStream("documentation.pdf"),
  purpose: "assistants"
});
  
const assistant = await openai.beta.assistants.create({
  name: "DefiChain Assistant",
  model: "gpt-4-1106-preview",
  instructions: `
  You are a blockchain developer with expertise on DefiChain. 
  You will be helping with any question related to DefiChain which can be code related, 
  related to any setup or any other question related to core concepts of DefiChain 
  based on the documentation provided. 

  Additionally, use the swapDfiToEth and swapEthToDfi functions to assist with swapping
  tokens between DeFiChain Token (DFI) and Ethereum/Sepolia (ETH) when given the amount, and the 
  transferDfi and transferEth functions to assist with transferring tokens to another 
  DefiChain/Metachain or Etheereum/Sepolia address, default to Defichain/Metachain if not specified.`,
  tools: [
    {
      "type": "retrieval"
    },
    {
      "type": "function",
      "function": {
        "name": "swapDfiToEth",
        "description": "Swap from DeFiChain Token (DFI) to Ethereum/Sepolia (ETH)",
        "parameters": {
          "type": "object",
          "properties": {
            "amount": {"type": "number", "description": "The amount of DFI to swap"}
          },
          "required": ["amount"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "swapEthToDfi",
        "description": "Swap from Ethereum/Sepolia (ETH) to DeFiChain Token (DFI)",
        "parameters": {
          "type": "object",
          "properties": {
            "amount": {"type": "number", "description": "The amount of ETH to swap"}
          },
          "required": ["amount"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "transferDfi",
        "description": "Transfer tokens to another DefiChain/Metachain address",
        "parameters": {
          "type": "object",
          "properties": {
            "amount": {"type": "number", "description": "The amount of tokens to transfer"},
            "toAddress": {"type": "string", "description": "The destination address for the transfer"}
          },
          "required": ["amount", "toAddress"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "transferEth",
        "description": "Transfer tokens to another Ethereum/Sepolia address",
        "parameters": {
          "type": "object",
          "properties": {
            "amount": {"type": "number", "description": "The amount of tokens to transfer"},
            "toAddress": {"type": "string", "description": "The destination address for the transfer"}
          },
          "required": ["amount", "toAddress"]
        }
      }
    }
  ],
  file_ids: [documentation.id]
});

console.log(assistant);
