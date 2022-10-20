import { controlMaskSymbol } from '../values';

const digitValuePattern = /\d/;
const nonDigitValuePattern = /\D/g;
const nonDigitMaskPattern = /[^\d#]/;

function sanitizeValue(value: string, mask: string) {
  let result = '';

  for (let i = 0; i < value.length; i += 1) {
    const valueSymbol = value[i];
    const maskSymbol = mask[i];

    if (
      maskSymbol === controlMaskSymbol
      && valueSymbol
      && digitValuePattern.test(valueSymbol)
    ) {
      result += valueSymbol;
    }
  }

  return result;
}

export default function getMaskedValue(value: string, mask: string) {
  nonDigitValuePattern.lastIndex = 0;

  const sanitizedValue = sanitizeValue(value, mask)
    .replace(nonDigitValuePattern, '');

  const valueIterator = sanitizedValue[Symbol.iterator]();
  let result = '';

  for (let i = 0; i < mask.length; i += 1) {
    const sourceValueSymbol = value[i];
    const maskSymbol = mask[i];
    const isSourceValueSymbolString = typeof sourceValueSymbol === 'string';
    const isMaskSymbolString = typeof maskSymbol === 'string';
    const isMaskSymbolNotDigit = isMaskSymbolString && nonDigitMaskPattern.test(maskSymbol);

    const isSourceValueNotDefined = isMaskSymbolString
      && sourceValueSymbol !== maskSymbol
      && maskSymbol !== controlMaskSymbol;

    const isMaskSymbolSame = isSourceValueSymbolString
      && isMaskSymbolString
      && maskSymbol === sourceValueSymbol
      && sourceValueSymbol !== controlMaskSymbol;

    if (isMaskSymbolNotDigit || isSourceValueNotDefined || isMaskSymbolSame) {
      result += maskSymbol;
      continue;
    }

    const { done, value: valueSymbol } = valueIterator.next();
    if (maskSymbol === controlMaskSymbol && !done && valueSymbol) {
      result += valueSymbol;
      continue;
    }

    break;
  }

  return result;
}
