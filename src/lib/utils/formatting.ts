import { BigNumber, BigNumberish, ethers } from 'ethers';
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from 'ethers/lib/utils';

export function roundDecimals(value: number, decimalPlaces: number): number {
  return Number(
    Math.round(+(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces
  );
}

export function toNumber(value: BigNumber, decimals?: number): number {
  if (decimals) {
    return Number(formatUnits(value, decimals));
  }
  return Number(formatEther(value));
}

export function toCommaString(value: BigNumber, decimals?: number) {
  if (decimals) {
    return ethers.utils.commify(toNumber(value, decimals));
  }
  return ethers.utils.commify(formatEther(value));
}

export class FormattedResult {
  constructor(public readonly value: BigNumber) {}

  formatEther(): string {
    return formatEther(this.value);
  }

  parseEther(): BigNumber {
    return parseEther(formatEther(this.value));
  }

  parseUnits(unitName: BigNumberish) {
    return parseUnits(formatEther(this.value), unitName);
  }

  formatUnits(unitName: BigNumberish): string {
    return formatUnits(this.value, unitName);
  }

  toNumber(decimals?: number): number {
    return toNumber(this.value, decimals);
  }

  toCommaString(decimals?: number) {
    return toCommaString(this.value, decimals);
  }
}
