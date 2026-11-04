import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { FC } from "react";

type Props = {
  src: string;
  UserName: string;
};
export const Profile: FC<Props> = ({ src, UserName }) => {
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>{UserName}</AvatarFallback>
    </Avatar>
  );
};
