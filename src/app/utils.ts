import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: `${process.env.NEXT_THIRDWEB_API_CLIENT_KEY}`,
});
