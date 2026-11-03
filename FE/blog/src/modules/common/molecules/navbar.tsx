"use client";

import { FC } from "react";
import { Profile } from "./avatar/avatar";
import { Separator } from "@/components/ui/separator";
import { IsLogin } from "@/hooks/use-login";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
type Props = {
  src: string ;
  UserName: string;
};

export const Navbar: FC<Props> = ({ src, UserName = "A" }) => {
  const char = UserName.charAt(0).toUpperCase();
  const router = useRouter()
  return (
    <>
    <div className="flex h-24 justify-between items-center px-3.5">
      <div className="text-2xl">InkWell</div>
      {IsLogin() ? <ul className="flex gap-3 text-xl">
        <li>Home</li>
        <li>Contact us</li>
        <li>About us</li>
        <li>
          <Profile src={src} UserName={char} />
        </li>
      </ul> : <Button onClick={()=> router.push('/auth/sign-in')}> Login</Button>}
    </div>
    <Separator />
    </>
  );
};
