import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export function getSession() {
  return getServerSession(getAuthOptions());
}
