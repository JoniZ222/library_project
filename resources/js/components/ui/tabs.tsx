import React, { ReactNode, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    children: ReactNode;
    className?: string;
}

interface TabsContextProps {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export function Tabs({ value, onValueChange, children, className = "" }: TabsProps) {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={cn("flex flex-col gap-y-4", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    children: ReactNode;
    className?: string;
}
export function TabsList({ children, className = "" }: TabsListProps) {
    return (
        <div className={cn("inline-flex rounded-lg bg-muted p-1", className)}>
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    value: string;
    children: ReactNode;
    className?: string;
}
export function TabsTrigger({ value, children, className = "" }: TabsTriggerProps) {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = ctx.value === value;
    return (
        <button
            type="button"
            onClick={() => ctx.onValueChange(value)}
            className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                isActive
                    ? "bg-background shadow text-primary"
                    : "text-muted-foreground hover:bg-muted/80",
                className
            )}
            aria-selected={isActive}
        >
            {children}
        </button>
    );
}

interface TabsContentProps {
    value: string;
    children: ReactNode;
    className?: string;
}
export function TabsContent({ value, children, className = "" }: TabsContentProps) {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error("TabsContent must be used within Tabs");
    if (ctx.value !== value) return null;
    return <div className={className}>{children}</div>;
}