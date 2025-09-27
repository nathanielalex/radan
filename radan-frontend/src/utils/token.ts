import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string; // email (from `subject`)
  userId: string;
  roles: string;
  exp: number;
  iat?: number;
}

export function getUserIdFromToken(token: string): string | null {
  try {
    //still need to take care of modified/expired token
    const decoded = jwtDecode<JwtPayload>(token);
    console.log(decoded.roles);
    return decoded.userId || null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

export function getRoleFromToken(token: string): string | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.roles || null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
