import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactNode } from "react";

export function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

interface BPProps {
  Type?: "row" | "col";
  children?: ReactNode;
}

export default function BP({ Type, children }: BPProps) {
  const layout =
    Type === "col"
      ? "flex-col gap-0 items-center"
      : "flex-row gap-3 items-center";

  return (
    <div className="w-[200px] cursor-pointer h-[350px] border border-5 rounded-lg p-5">
      <div className={`w-full flex ${layout}`}>
        {children || (
          <>
            <div>
              <AvatarDemo />
            </div>
            <div>
              <h1>Your name</h1>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
