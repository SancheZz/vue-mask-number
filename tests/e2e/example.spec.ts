import { chromium } from 'playwright';
import { saveVideo } from 'playwright-video';

import type { ChromiumBrowser, ElementHandle, JSHandle, Page } from 'playwright';
import type { PageVideoCapture } from 'playwright-video';

describe('VueMaskNumber', () => {
  let browser: ChromiumBrowser;
  let page: Page;
  let capture: PageVideoCapture;

  const placeholderCssClassName = 'mask-placeholder';
  const placeholderCssClassNameHidden = 'mask-placeholder--hidden';

  beforeAll(async () => {
    browser = await chromium.launch({ slowMo: 100 });
    page = await browser.newPage();
    await page.goto('http://localhost:8080/');
    capture = await saveVideo(page, 'tests/e2e/videos/example.mp4');
  });

  afterAll(async () => {
    await capture.stop();
    await page.close();
    await browser.close();
  });

  describe('with default params', () => {
    type Container = ElementHandle<HTMLElement> | null;
    type Input = ElementHandle<HTMLInputElement> | null | undefined;
    type Placeholder = ElementHandle<HTMLElement> | null | undefined;
    type ValueHandle = JSHandle<string> | undefined;
    type SelectionStartHandle = JSHandle<number> | undefined;

    const componentSelector = '[data-playwright="defaults"]';

    let container: Container;
    let input: Input;
    let placeholder: Placeholder;

    beforeAll(async () => {
      container = await page.$(componentSelector) as Container;
      input = await container?.$('input') as Input;
      placeholder = await container?.$(`.${placeholderCssClassName}`) as Placeholder;
    });

    it('has component', async () => {
      expect(container).not.toBe(null);
      expect(input).not.toBe(null);
    });

    it('does not have mask when unfocusing', async () => {
      expect(input).not.toBe(null);
      const isHidden = await placeholder?.evaluate(
        (element, className) => element.classList.contains(className),
        placeholderCssClassNameHidden,
      );
      expect(isHidden).toBe(true);
    });

    it('has mask when focusing', async () => {
      await input?.focus();
      const isHidden = await placeholder?.evaluate(
        (element, className) => element.classList.contains(className),
        placeholderCssClassNameHidden,
      );
      expect(isHidden).toBe(false);
    });

    it('will have just mask as value if user does not type', async () => {
      const valueHandle: ValueHandle = await input?.getProperty('value');
      const value = await valueHandle?.jsonValue();
      expect(value).toBe('+47 1');

      const selectionStartHandle: SelectionStartHandle = await input?.getProperty('selectionStart');
      const selectionStart = await selectionStartHandle?.jsonValue();
      expect(selectionStart).toBe(5);
    });

    it('will have just mask as value if user tries remove it', async () => {
      for (let i = 0; i < 5; i += 1) {
        await page.keyboard.press('Backspace');
      }

      const valueHandle: ValueHandle = await input?.getProperty('value');
      const value = await valueHandle?.jsonValue();
      expect(value).toBe('+47 1');

      const selectionStartHandle: SelectionStartHandle = await input?.getProperty('selectionStart');
      const selectionStart = await selectionStartHandle?.jsonValue();
      expect(selectionStart).toBe(5);
    });

    it('should not use non digit user\'s input', async () => {
      await input?.type('hello123 world 45');

      const valueHandle: ValueHandle = await input?.getProperty('value');
      const value = await valueHandle?.jsonValue();
      expect(value).toBe('+47 1 first numbers 1234  second numbers 5');
    });

    it('it should set caret correctly if a removed value is following by non digit', async () => {
      const expectedValue = '+47 1 first numbers 1234';

      await page.keyboard.press('Backspace');

      const valueHandle: ValueHandle = await input?.getProperty('value');
      const value = await valueHandle?.jsonValue();
      expect(value).toBe(expectedValue);

      const selectionStartHandle: SelectionStartHandle = await input?.getProperty('selectionStart');
      const selectionStart = await selectionStartHandle?.jsonValue();
      expect(selectionStart).toBe(expectedValue.length);
    });

    it('will show just mask when user selects and removes value', async () => {
      await input?.evaluate(input => input.select());
      await page.keyboard.press('Backspace');

      const valueHandle: ValueHandle = await input?.getProperty('value');
      const value = await valueHandle?.jsonValue();
      expect(value).toBe('+47 1');
    });

    it('should insert user\'s digit value to next mask position if it is following by digit', async () => {
      const expectedValue = '+47 1 first numbers 1234  second numbers 5678';

      await input?.type('12348');
      await page.keyboard.press('ArrowLeft');
      await input?.type('567');

      const valueHandle: ValueHandle = await input?.getProperty('value');
      const value = await valueHandle?.jsonValue();
      expect(value).toBe(expectedValue);

      const selectionStartHandle: SelectionStartHandle = await input?.getProperty('selectionStart');
      const selectionStart = await selectionStartHandle?.jsonValue();
      expect(selectionStart).toBe(expectedValue.length - 1);
    });

    it('has max length calculated by mask', async () => {
      const expectedValue = '+47 1 first numbers 1111  second numbers 1111';

      await input?.evaluate(input => input.select());
      await page.keyboard.press('Backspace');
      await input?.type('1'.repeat(20));
      const valueHandle: ValueHandle = await input?.getProperty('value');
      const value = await valueHandle?.jsonValue();
      expect(value).toBe(expectedValue);
    });
  });

  describe('when mask is always visible with [mask-always-visible] prop', () => {
    type Container = ElementHandle<HTMLElement> | null;
    type Input = ElementHandle<HTMLInputElement> | null | undefined;
    type Placeholder = ElementHandle<HTMLElement> | null | undefined;

    const componentSelector = '[data-playwright="mask-always-visible"]';

    let container: Container;
    let input: Input;
    let placeholder: Placeholder;

    beforeAll(async () => {
      container = await page.$(componentSelector) as Container;
      input = await container?.$('input') as Input;
      placeholder = await container?.$(`.${placeholderCssClassName}`) as Placeholder;
    });

    it('has component', async () => {
      expect(container).not.toBe(null);
      expect(input).not.toBe(null);
    });

    it('should shouw mask placeholder', async () => {
      expect(placeholder).not.toBe(null);
    });
  });
});
