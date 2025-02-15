import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function FormTooltip({ content }: { content: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
