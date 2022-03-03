import { BigNumber, BigNumberish, ethers } from 'ethers';

export function roundDecimals(value: number, decimalPlaces: number): number {
  return Number(
    Math.round(+(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces
  );
}

export function toNumber(value: BigNumber, decimals?: number): number {
  if (decimals) {
    return Number(ethers.utils.formatUnits(value, decimals));
  }
  return Number(ethers.utils.formatEther(value));
}

export function toCommaString(value: BigNumber, decimals?: number) {
  if (decimals) {
    return ethers.utils.commify(toNumber(value, decimals));
  }
  return ethers.utils.commify(ethers.utils.formatEther(value));
}

export class FormattedResult {
  constructor(public readonly value: BigNumber) {}

  formatEther(): string {
    return ethers.utils.formatEther(this.value);
  }

  parseEther(): BigNumber {
    return ethers.utils.parseEther(ethers.utils.formatEther(this.value));
  }

  parseUnits(unitName: BigNumberish) {
    return ethers.utils.parseUnits(
      ethers.utils.formatEther(this.value),
      unitName
    );
  }

  formatUnits(unitName: BigNumberish): string {
    return ethers.utils.formatUnits(this.value, unitName);
  }

  toNumber(decimals?: number): number {
    return toNumber(this.value, decimals);
  }

  toCommaString(decimals?: number) {
    return toCommaString(this.value, decimals);
  }
}
