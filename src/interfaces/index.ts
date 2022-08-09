export type Address = `0x${string}`;

export interface NFTData {
  price: string;
  tokenId: string;
  seller: Address;
  owner: Address;
  image: string;
  name: string;
  description: string;
  tokenURI: string;
}

export enum CardType {
  Noraml,
  WithListBtn,
  WithBuyBtn,
}
