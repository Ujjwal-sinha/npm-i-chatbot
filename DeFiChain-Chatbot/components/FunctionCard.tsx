import * as React from "react";
import ReactMarkdown from 'react-markdown';
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { useSendTransaction, useNetwork, useSwitchNetwork } from 'wagmi';
import { parseEther } from 'viem';

export interface FunctionCardProps {
	name: string;
  args: any;
  address: string;
}

export const FunctionCard: React.FC<FunctionCardProps> = (props) => {
  const [executed, setExecuted] = React.useState(false);
  const [cancelled, setCancelled] = React.useState(false);

  const { sendTransaction, isLoading, isSuccess, error } = useSendTransaction();
  const { chain } = useNetwork();
  const { switchNetworkAsync, isLoading: isSwitchingNetwork } = useSwitchNetwork();

  const parsedArgs = typeof props.args === 'string' ? JSON.parse(props.args) : props.args;

  const handleTransfer = async () => {
    if (props.name === 'transferDfi') {
      if (chain?.id !== 1131 && switchNetworkAsync) {
        try {
          await switchNetworkAsync(1131);
        } catch (switchError) {
          console.error('Error during network switch:', switchError);
          return;
        }
      }
    } else if (props.name === 'transferEth') {
      if (chain?.id !== 11155111 && switchNetworkAsync) {
        try {
          await switchNetworkAsync(11155111);
        } catch (switchError) {
          console.error('Error during network switch:', switchError);
          return;
        }
      }
    }

    try {
      sendTransaction({
        to: parsedArgs.toAddress,
        value: parseEther(parsedArgs.amount.toString()),
      });
    } catch (transactionError) {
      console.error('Error during transfer:', transactionError);
    }
  };

  if (isLoading || isSwitchingNetwork) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Successful</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-[500px] overflow-y-auto max-h-[72vh]">
        <CardHeader>
          <CardTitle>Transaction Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>{error.message}</Label>
        </CardContent>
      </Card>
    );
  }

  const handleCancel = () => {
    console.log('Swap Cancelled.');
    setCancelled(true);
  };

  const handleSwap = async () => {
    if (props.name === 'swapDfiToEth') {
      if (chain?.id !== 1131 && switchNetworkAsync) {
        try {
          await switchNetworkAsync(1131);
        } catch (switchError) {
          console.error('Error during network switch:', switchError);
          return;
        }
      }
    } else if (props.name === 'swapEthToDfi') {
      if (chain?.id !== 11155111 && switchNetworkAsync) {
        try {
          await switchNetworkAsync(11155111);
        } catch (switchError) {
          console.error('Error during network switch:', switchError);
          return;
        }
      }
    }

    try {
      if (props.name === 'swapDfiToEth') {
        sendTransaction({
          to: '0xa975679009a96DbdDa0874E5F1443F297Fc4E890',
          value: parseEther(parsedArgs.amount.toString()),
        });

        const response = await fetch('/api/swap/toeth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: parsedArgs.amount, address: props.address }),
        });

        const data = await response.json();
        if (data.success) {
          setExecuted(true);
        } else {
          throw new Error(data.message || 'Swap failed');
        }
        
      } else if (props.name === 'swapEthToDfi') {
        sendTransaction({
          to: '0xa975679009a96DbdDa0874E5F1443F297Fc4E890',
          value: parseEther(parsedArgs.amount.toString()),
        });

        const response = await fetch('/api/swap/todfi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: parsedArgs.amount, address: props.address }),
        });

        const data = await response.json();
        if (data.success) {
          setExecuted(true);
        } else {
          throw new Error(data.message || 'Swap failed');
        }
      }
    } catch (error) {
      console.error('Error during swap:', error);
    }
  };

  if (executed) {
    return (
      <Card className="w-[130px] overflow-y-auto max-h-[72vh]">
        <CardHeader>
          <CardTitle>Swapped</CardTitle>
          <CardDescription>not really</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (cancelled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Rejected</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  switch (props.name) {
    case 'swapDfiToEth':
      return (
        <Card className="w-[325px] overflow-y-auto max-h-[72vh]">
          <CardHeader>
            <CardTitle>Swap (DeFiChain -&gt; Ethereum)</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Amount: {parsedArgs.amount}</Label>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSwap}>Confirm</Button>
          </CardFooter>
        </Card>
      );

    case 'swapEthToDfi':
      return (
        <Card className="w-[325px] overflow-y-auto max-h-[72vh]">
          <CardHeader>
            <CardTitle>Swap (Ethereum -&gt; DeFiChain)</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Amount: {parsedArgs.amount}</Label>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSwap}>Confirm</Button>
          </CardFooter>
        </Card>
      );

    case 'transferDfi':
      return (
        <Card className="w-[450px] overflow-y-auto max-h-[72vh]">
          <CardHeader>
            <CardTitle>Transfer Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Amount: {parsedArgs.amount} DFI</Label>
            <br/>
            <Label>Recipient: {parsedArgs.toAddress}</Label>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleTransfer}>Confirm</Button>
          </CardFooter>
        </Card>
      );

    case 'transferEth':
      return (
        <Card className="w-[450px] overflow-y-auto max-h-[72vh]">
          <CardHeader>
            <CardTitle>Transfer Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Amount: {parsedArgs.amount} ETH</Label>
            <br/>
            <Label>Recipient: {parsedArgs.toAddress}</Label>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleTransfer}>Confirm</Button>
          </CardFooter>
        </Card>
      );

    default:
      return (
        <Card className="w-[150px]">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Invalid Function</Label>
          </CardContent>
        </Card>
      );
  }
};
