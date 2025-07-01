import { Textarea as TextareaPrimitive } from "@headlessui/react";
import { cn } from "@/lib/utils";

export default function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return <TextareaPrimitive className={cn("w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)} {...props} />;
}