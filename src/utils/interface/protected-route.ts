import type { ProtectedRouteMode } from "../types/protected-route";

export interface ProtectedRouteProps {
  mode?: ProtectedRouteMode; 
  promptDelayMs?: number; 
}