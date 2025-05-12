import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils"; // Make sure you have this utility installed

type TabGroupProps = {
  setActiveTab: Dispatch<SetStateAction<string>>;
  activeTab: string;
};

const TabButton = ({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) => {
  return (
    <button
      data-state={active ? "active" : "inactive"}
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1.5 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 cursor-pointer disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
};

export function TabGroup({ setActiveTab, activeTab }: TabGroupProps) {
  return (
    <div className="flex gap-1 p-1 bg-gray-300 rounded-md">
      <TabButton
        active={activeTab === "signIn"}
        onClick={() => setActiveTab("signIn")}
      >
        Sign In
      </TabButton>
      <TabButton
        active={activeTab === "signUp"}
        onClick={() => setActiveTab("signUp")}
      >
        Sign Up
      </TabButton>
    </div>
  );
}
