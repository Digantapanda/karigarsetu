import { cookies } from "next/headers";
import {
  DEFAULT_INTERFACE_MODE,
  INTERFACE_MODE_COOKIE,
  isInterfaceMode,
  type InterfaceMode,
} from "@/lib/interface-mode/config";

export async function getInterfaceMode(): Promise<InterfaceMode> {
  const cookieStore = await cookies();
  const value = cookieStore.get(INTERFACE_MODE_COOKIE)?.value;
  return value && isInterfaceMode(value) ? value : DEFAULT_INTERFACE_MODE;
}
