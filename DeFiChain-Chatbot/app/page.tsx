'use client'

import * as React from 'react'
import { useState } from 'react';
import { useAccount as useEthereumWallet } from 'wagmi'
import Textarea from 'react-textarea-autosize'
import { IconArrowElbow } from '@components/ui/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import { Button } from '@components/ui/button';
import { Skeleton } from "@components/ui/skeleton"
import { MessageCard } from '@components/MessageCard';
import { FunctionCard } from '@components/FunctionCard';
import { ErrorCard } from '@components/ErrorCard';
import { WeirdStatusCard } from '@components/WeirdStatusCard';

function Page() {
  const { address: ethereumAccount } = useEthereumWallet()
  const [prompt, setPrompt] = useState('');
  const [isFunction, setIsFunction] = useState(false);
  const [functionName, setFunctionName] = useState('');
  const [functionArgs, setFunctionArgs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isWeirdStatus, setIsWeirdStatus] = useState(false);
  const [weirdStatusMessage, setWeirdStatusMessage] = useState('');
  const [isMessage, setIsMessage] = useState(false);
  const [message, setMessage] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitPrompt();
    }
  };

  const submitPrompt = async () => {
    setIsLoading(true);

    const currentPrompt = prompt;
    // setPrompt('');

    const ethereumAddress = ethereumAccount || null;

    const payload = {
      prompt: currentPrompt,
      address: ethereumAddress
    };

    const request = await fetch('/api/assistants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const response = await request.json();

    if (response.function) {
      setIsError(false);
      setIsWeirdStatus(false);
      setIsMessage(false);
      setIsFunction(true);
      setFunctionName(response.function);
      setFunctionArgs(response.arguments);
      setIsLoading(false);

      console.log('Function: ', functionName);
      console.log('Arguments: ', functionArgs);
      return;

    } else if (response.message) {
      setIsError(false);
      setIsWeirdStatus(false);
      setIsFunction(false);
      setIsMessage(true);
      setMessage(response.message);
      setIsLoading(false);
      return;

    } else if (response.error) {
      console.error("Error: ", response.error);
      setIsFunction(false);
      setIsMessage(false);
      setIsWeirdStatus(false);
      setIsError(true);
      setErrorMessage(response.error);
      setIsLoading(false);
      return;

    } else if (response.weird_status) {
      console.error("Weird Status: ", response.weird_status);
      setIsFunction(false);
      setIsMessage(false);
      setIsError(false);
      setIsWeirdStatus(true);
      setWeirdStatusMessage(response.weird_status);
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className="w-full h-full">
      <div className="fixed inset-x-0 mx-auto sm:max-w-2xl sm:px-4" style={{ top: '10%' }}>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-xl sm:border md:py-4">
          <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
            <Textarea
              ref={React.useRef<HTMLTextAreaElement>(null)}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Send a message."
              spellCheck={false}
              className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm box-sizing:border-box"
            />
            <div className="absolute right-0 top-4 sm:right-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={submitPrompt}
                    size="icon"
                    disabled={prompt === ''}
                    className="w-8 h-8 box-sizing:border-box"
                  >
                    <IconArrowElbow />
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send message</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center space-x-4 mt-36">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : isMessage ? (
        <div className="mt-36 flex justify-center items-center">
          <MessageCard message={message}/>
        </div>
      ) : isFunction ? (
        <div className="mt-36 flex justify-center items-center">
          <FunctionCard name={functionName} args={functionArgs} address={ethereumAccount?.toString() as string}/>
        </div>
      ) : isError ? (
        <div className="mt-36 flex justify-center items-center">
          <ErrorCard errorMessage={errorMessage}/>
        </div>
      ) : isWeirdStatus ? (
        <div className="mt-36 flex justify-center items-center">
          <WeirdStatusCard weirdStatusMessage={weirdStatusMessage}/>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Page;
