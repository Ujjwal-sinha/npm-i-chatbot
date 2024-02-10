import * as React from "react";
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

export interface ErrorCardProps {
	errorMessage: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = (props) => {
	return (
		<Card className="w-[300px]">
			<CardHeader>
				<CardTitle>Error</CardTitle>
			</CardHeader>
			<CardContent>
				<Label>{props.errorMessage}</Label>
			</CardContent>
		</Card>
	);
};
