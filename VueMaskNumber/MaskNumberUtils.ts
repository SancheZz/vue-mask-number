const nonUsedFirstSymbolsPattern = /^[^\d+]+/;
const nonUsedSymbolsPattern = /(^[\d+]+)?\D*/g;
const usedMaskSymbolsPattern = /[\d+#]/;
const valuePattern = /(^.*\d)?\D*/g;

/**
 * insert the first character plus if necessary
 * @param  {String} input
 * @param  {String} mask
 * @return {String}
 */
function insertFirstPlus (input = '', mask = ''): string {
  const isInputWithMask = input.startsWith('+');
  const isMaskWithMask = mask.startsWith('+');

  switch (true) {
    case isInputWithMask && !isMaskWithMask:
      return input.slice(1);

    case !isInputWithMask && isMaskWithMask:
      return `+${input}`;

    default:
      return input;
  }
}

/**
 * extract numbers from input value
 * @param  {String} value
 * @param  {String} mask
 * @return {String}
 */
export function validateValue (value = '', mask = ''): string {
  const clearedMask = mask.replace(nonUsedSymbolsPattern, '$1');
  const clearedValue = value
    .replace(nonUsedFirstSymbolsPattern, '')
    .replace(nonUsedSymbolsPattern, '$1');

  const valueAsPhone = insertFirstPlus(clearedValue, clearedMask);
  return valueAsPhone.startsWith(clearedMask)
    ? valueAsPhone
    : clearedMask;
}

/**
 * map numbers sequence on the mask
 * @param  {String} value
 * @param  {String} mask
 * @return {String}
 */
export function mapValueOnMask (value = '', mask = ''): string {
  const valueIterator = value[Symbol.iterator]();
  const characters = [];

  for (const maskCharacter of mask) {
    if (usedMaskSymbolsPattern.test(maskCharacter)) {
      const { value, done } = valueIterator.next();
      if (done) {
        characters.push(maskCharacter);
      } else {
        characters.push(value);
      }
    } else {
      characters.push(maskCharacter);
    }
  }

  return characters.join('');
}

/**
 * get substring with a last number
 * @param  {String} value
 * @return {String}
 */
export function extractValue (value = ''): string {
  return value.replace(valuePattern, '$1');
}

/**
 * get right caret position when user presses any key
 * @param  {String} newValue
 * @param  {String} oldValue
 * @param  {Number} selectionStart
 * @return {Number}
 */
export function getCaretPosition (
  newValue = '',
  oldValue = '',
  selectionStart: number,
): number {
  const nonDigitalPattern = /\D/;
  const digitalPattern = /\d/;
  const lastNumberPattern = /\D+$/;
  const newValueLength = newValue.length;
  const oldValueLength = oldValue.length;
  const prevCharacter = newValue[selectionStart - 1] as string;

  switch (true) {
    case newValueLength > oldValueLength && nonDigitalPattern.test(prevCharacter): {
      const substring = newValue.slice(selectionStart);
      return selectionStart + substring.search(digitalPattern) + 1;
    }

    case newValueLength < oldValueLength && nonDigitalPattern.test(prevCharacter): {
      const substring = newValue.slice(0, selectionStart);
      return substring.search(lastNumberPattern);
    }

    default:
      return selectionStart;
  }
}
