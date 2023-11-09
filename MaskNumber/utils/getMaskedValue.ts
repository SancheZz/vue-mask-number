import { controlMaskSymbol } from '../values';

const nonDigitMaskPattern = /[\D#]/g;

export default function getMaskedValue(value: string, mask: string) {
  nonDigitMaskPattern.lastIndex = 0;
  const valueIterator = value.replace(nonDigitMaskPattern, '')[Symbol.iterator]();
  const maskIterator = mask[Symbol.iterator]();
  let valueYieldValue = valueIterator.next();
  let result = '';

  for (const maskYieldedValue of maskIterator) {
    if (valueYieldValue.done) {
      break;
    }

    if (!valueYieldValue.done && valueYieldValue.value === maskYieldedValue) {
      result += maskYieldedValue;
      valueYieldValue = valueIterator.next();
      continue;
    }

    if (maskYieldedValue !== controlMaskSymbol) {
      result += maskYieldedValue;
      continue;
    }

    result += valueYieldValue.value;
    valueYieldValue = valueIterator.next();
  }

  for (const character of valueIterator) {
    result += character;
  }

  return result;
}
