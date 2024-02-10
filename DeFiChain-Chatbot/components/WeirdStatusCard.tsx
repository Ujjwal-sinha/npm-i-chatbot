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

export interface WeirdStatusCardProps {
	weirdStatusMessage: string;
}

export const WeirdStatusCard: React.FC<WeirdStatusCardProps> = (props) => {
	return (
		<Card className="w-[300px]">
			<CardHeader>
				<CardTitle>Weird Status</CardTitle>
			</CardHeader>
			<CardContent>
				<Label>{props.weirdStatusMessage}</Label>
			</CardContent>
		</Card>
	);
};
