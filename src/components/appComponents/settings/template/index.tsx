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
  flexDirection?: "row" | "col";
  gap?: number;
  children?: ReactNode;
}

const BP = ({ flexDirection = "col", gap = 3, children }: BPProps) => {
  return (
    <>
      <div className="w-[200px] cursor-pointer h-[350px] border border-5 rounded-lg p-5">
        <div
          className={`w-full flex flex-${flexDirection} gap-${gap} items-center`}
        >
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
    </>
  );
};

export default function Template() {
  return (
    <>
      <div className="w-[100%] h-screen flex items-center justify-center gap-5">
        <BP flexDirection="row" gap={2} />
        <BP flexDirection="col" gap={0} />
      </div>
    </>
  );
}
