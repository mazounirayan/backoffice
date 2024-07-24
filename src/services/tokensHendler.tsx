import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000); 
    return decodedToken.exp < currentTime;
  } catch (e) {
    console.error('Failed to decode token', e);
    return true; 
  }
};