const puppeteer = require('puppeteer');

describe('E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.goto('http://localhost:8080');
    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  it('should display "Server is ready" on the page', async () => {
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('Server is ready');
  });

  it('должен подсветить иконку Visa после ввода первых 4 цифр', async () => {
    await page.type('#cardNumber', '4123');
    const visaIcon = await page.$eval('.visa-icon', el => window.getComputedStyle(el).display);
    expect(visaIcon).not.toBe('none');
  });

  it('должен подсветить иконку Мир после ввода первых 4 цифр', async () => {
    await page.type('#cardNumber', '2200');
    const mirIcon = await page.$eval('.mir-icon', el => window.getComputedStyle(el).display);
    expect(mirIcon).not.toBe('none');
  });

  it('должен ограничить ввод 16 цифрами', async () => {
    await page.type('#cardNumber', '12345678901234567890');
    const value = await page.$eval('#cardNumber', el => el.value);
    expect(value.length).toBe(16);
  });

  it('должен показать "Номер карты подтвержден" для валидной Visa карты и подсветить иконку Visa', async () => {
    await page.type('#cardNumber', '4123456789012345');
    const text = await page.$eval('#result', el => el.textContent);
    const visaIcon = await page.$eval('.visa-icon', el => window.getComputedStyle(el).display);
    expect(text).toContain('Номер карты подтвержден');
    expect(visaIcon).not.toBe('none');
  });

  it('должен показать "Недействительный номер карты" для недействительной карты', async () => {
    await page.type('#cardNumber', '1234567890123456');
    const text = await page.$eval('#result', el => el.textContent);
    expect(text).toContain('Недействительный номер карты');
  });

  it('должен показать "Номер карты подтвержден" для валидной Мир карты и подсветить иконку Мир', async () => {
    await page.type('#cardNumber', '2200123456789012');
    const text = await page.$eval('#result', el => el.textContent);
    const mirIcon = await page.$eval('.mir-icon', el => window.getComputedStyle(el).display);
    expect(text).toContain('Номер карты подтвержден');
    expect(mirIcon).not.toBe('none');
  });
});