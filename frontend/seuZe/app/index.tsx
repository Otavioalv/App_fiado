import { useSession } from "@/src/context/authContext";
import { UserType } from "@/src/types/userType";
import { Redirect } from "expo-router";

export default function Index() {
  const {session, userType} = useSession();

  if(session && (userType as UserType) === "cliente")
    return <Redirect href={"/(cliente)/home"}/>

  if(session && (userType as UserType) === "fornecedor")
    return <Redirect href={"/(fornecedor)/home"}/>
  
  
  return <Redirect href={"/(auth)/login"}/>
}
