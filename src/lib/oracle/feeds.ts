export const CHAINLINK_FEEDS: Record<string, { feed: string; decimals: number }> = {
  ETH: { feed: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70", decimals: 8 },
  BTC: { feed: "0xCCADC697c55bbB68dc5bCdf8d3CBe83CdD4E071E", decimals: 8 },
  USDC: { feed: "0x7e860098F58bBFC8648a4311b374B1D669a2bc6B", decimals: 8 },
  AERO: { feed: "0x4EC5970fC728C5f65ba413992CD5fF6FD70fcfF0", decimals: 8 },
  LINK: { feed: "0x17CAb8FE31cA45E740a1B68a36992dc4b2413c7D", decimals: 8 },
};
export const STALE_PRICE_THRESHOLD = 3600;
export const DEVIATION_THRESHOLD = 2;
