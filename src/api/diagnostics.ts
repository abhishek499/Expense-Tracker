import * as AuthSession from 'expo-auth-session';

export const getRedirectUri = () => {
  const redirectUri = AuthSession.makeRedirectUri();
  console.log("Your Google Redirect URI should be:", redirectUri);
  return redirectUri;
};
