/**
 * @jest-environment jest-environment-node
 */
import puppeteer from 'puppeteer';

describe('Форма валидатора кредитных карт', () => {
  let browser;
  let page;

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('http://localhost:8080');
  });

  afterAll(async () => {
    await browser.close();
  });

  it(async () => {
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('Server is ready');
  });

  test('должен подсветить иконку Visa после ввода первых 4 цифр', async () => {
    await page.type('#card-number', '4111');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const visaImageActive = await page.$eval('.card-image[data-system="visa"]', (el) => {
      const style = window.getComputedStyle(el);
      return !style.filter.includes('grayscale');
    });
    expect(visaImageActive).toBe(true);

    const otherImagesInactive = await page.$$eval('.card-image:not([data-system="visa"])', (els) =>
      els.every((el) => window.getComputedStyle(el).filter.includes('grayscale'))
    );
    expect(otherImagesInactive).toBe(true);
  });

  test('должен подсветить иконку Мир после ввода первых 4 цифр', async () => {
    await page.reload();
    await page.type('#card-number', '2200');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mirImageActive = await page.$eval('.card-image[data-system="mir"]', (el) => {
      const style = window.getComputedStyle(el);
      return !style.filter.includes('grayscale');
    });
    expect(mirImageActive).toBe(true);

    const otherImagesInactive = await page.$$eval('.card-image:not([data-system="mir"])', (els) =>
      els.every((el) => window.getComputedStyle(el).filter.includes('grayscale'))
    );
    expect(otherImagesInactive).toBe(true);
  });

  test('должен ограничить ввод 16 цифрами', async () => {
    await page.reload();
    await page.type('#card-number', '12345678901234567890');
    const inputValue = await page.$eval('#card-number', (el) => el.value);
    expect(inputValue.length).toBe(16);
  });

  test('должен показать "Номер карты подтвержден" для валидной Visa карты и подсветить иконку Visa', async () => {
    await page.reload();
    await page.type('#card-number', '4111111111111111'); // Валиден по Луна
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const resultText = await page.$eval('#result', (el) => el.textContent);
    expect(resultText).toBe('Номер карты подтвержден');

    const visaImageActive = await page.$eval('.card-image[data-system="visa"]', (el) => {
      const style = window.getComputedStyle(el);
      return !style.filter.includes('grayscale');
    });
    expect(visaImageActive).toBe(true);
  });

  test('должен показать "Недействительный номер карты" для недействительной карты', async () => {
    await page.reload();
    await page.type('#card-number', '4111111111111110'); // Недействителен по Луна
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const resultText = await page.$eval('#result', (el) => el.textContent);
    expect(resultText).toBe('Недействительный номер карты');

    const allImagesInactive = await page.$$eval('.card-image', (els) =>
      els.every((el) => window.getComputedStyle(el).filter.includes('grayscale'))
    );
    expect(allImagesInactive).toBe(true);
  });

  test('должен показать "Номер карты подтвержден" для валидной Мир карты и подсветить иконку Мир', async () => {
    await page.reload();
    await page.type('#card-number', '2200000000000053'); // Валиден по Луна
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const resultText = await page.$eval('#result', (el) => el.textContent);
    expect(resultText).toBe('Номер карты подтвержден');

    const mirImageActive = await page.$eval('.card-image[data-system="mir"]', (el) => {
      const style = window.getComputedStyle(el);
      return !style.filter.includes('grayscale');
    });
    expect(mirImageActive).toBe(true);
  });
});