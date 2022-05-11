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

export const getGravePrice = async () => {
  const { pair } = await getPairInfo(
    'avalanche',
    '0x10E882aCfae3Cf63e96741FaBc41c19025E7be2a'
  );

  return Number(pair.priceUsd);
};

export const getGSharePrice = async () => {
  const { pair } = await getPairInfo(
    'avalanche',
    '0xae427aD7a54f5490eF76b3bDe3663b0e45c7A102'
  );

  return Number(pair.priceUsd);
};

