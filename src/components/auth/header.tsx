import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import key_lock from "@/assets/key-lock.png";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const Header = ({ label }: { label: string }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-y-1">
      <h1
        className={cn(
          "text-3xl font-semibold drop-shadow-md flex items-center justify-center gap-1",
          font.className
        )}
      >
        <Image
          src={key_lock}
          alt="key lock image"
          height={30}
          className="mb-2"
        />
        Auth
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
