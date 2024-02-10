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

export interface MessageCardProps {
	message: string;
}

export const MessageCard: React.FC<MessageCardProps> = (props) => {
	return (
		<Card className="w-[1000px] max-h-[720px] overflow-y-auto custom-scroll">
			<CardHeader>
				<CardTitle>DeFi ChatBot says:</CardTitle>
			</CardHeader>
			<CardContent>
				<ReactMarkdown>{props.message}</ReactMarkdown>
			</CardContent>
		</Card>
	);
};
