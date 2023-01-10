import {
  Metaplex,
  CreateListingInput,
  CreateListingOutput,
  SolAmount,
  sol,
} from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey, Signer } from "@solana/web3.js";
import auctionHouseCache from "../../blockend/auctionHouse/cache.json";

export async function createBikeListing(
  metaplex: Metaplex,
  seller: PublicKey,
  bikeMint: PublicKey,
  price: number
): Promise<CreateListingOutput> {
  const auctionHouse = await metaplex
    .auctionHouse()
    .findByAddress({ address: new PublicKey(auctionHouseCache.address) });

  //TODO: Write function to get server keypair
  const secret = JSON.parse(
    process.env.NEXT_PUBLIC_PRIVATE_KEY ?? ""
  ) as number[];
  const secretKey = Uint8Array.from(secret);
  const keypair = Keypair.fromSecretKey(secretKey);

  const input: CreateListingInput = {
    auctionHouse,
    seller,
    authority: keypair,
    mintAccount: bikeMint,
    price: sol(price),
  };

  const output = await metaplex.auctionHouse().list(input);

  return output;
}
