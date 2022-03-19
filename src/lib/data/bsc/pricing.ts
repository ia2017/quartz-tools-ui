import { getPairInfo } from 'src/lib/utils/dex-screener';

export const getAsharePrice = async () => {
  const { pair } = await getPairInfo(
    'bsc',
    '0x39846550Ef3Cb8d06E3CFF52845dF42F71Ac3851'
  );

  return Number(pair.priceUsd);
};

export const getAmethystPrice = async () => {
  const { pair } = await getPairInfo(
    'bsc',
    '0x6f78A0d31aDC7C9FB848850F9D2a40Da5858Ad03'
  );

  return Number(pair.priceUsd);
};
