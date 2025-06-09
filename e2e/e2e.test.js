const puppeteer = require('puppeteer');

describe('Credit Card Validator E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 10000, // Увеличенный тайм-аут для запуска браузера
    });
    page = await browser.newPage();
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
  }, 15000); // Увеличенный тайм-аут для beforeAll

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    await page.reload({ waitUntil: 'networkidle2' }); // Перезагрузка страницы
    await page.waitForSelector('#card-number'); // Ожидание поля ввода
  });

  it('должен подсветить иконку Visa после ввода первых 4 цифр', async () => {
    await page.type('#card-number', '4111');
    const visaIconFilter = await page.$eval('.card-image[data-system="visa"]', el => window.getComputedStyle(el).filter);
    expect(visaIconFilter).toBe('none');
  });

  it('должен подсветить иконку Мир после ввода первых 4 цифр', async () => {
    await page.type('#card-number', '2200');
    const mirIconFilter = await page.$eval('.card-image[data-system="mir"]', el => window.getComputedStyle(el).filter);
    expect(mirIconFilter).toBe('none');
  });

  it('должен ограничить ввод 16 цифрами', async () => {
    await page.type('#card-number', '12345678901234567890');
    const value = await page.$eval('#card-number', el => el.value);
    expect(value.length).toBe(16);
  });

  it('должен показать "Номер карты подтвержден" для валидной Visa карты и подсветить иконку Visa', async () => {
    await page.type('#card-number', '4111111111111111');
    await page.click('button[type="submit"]');
    await page.waitForSelector('#result:not(:empty)', { timeout: 2000 });
    const result = await page.$eval('#result', el => el.textContent);
    const visaIconFilter = await page.$eval('.card-image[data-system="visa"]', el => window.getComputedStyle(el).filter);
    expect(result).toBe('Номер карты подтвержден');
    expect(visaIconFilter).toBe('none');
  });

  it('должен показать "Недействительный номер карты" для недействительной карты', async () => {
    await page.type('#card-number', '1234567890123456');
    await page.click('button[type="submit"]');
    await page.waitForSelector('#result:not(:empty)', { timeout: 2000 });
    const result = await page.$eval('#result', el => el.textContent);
    expect(result).toBe('Недействительный номер карты');
  });

  it('должен показать "Номер карты подтвержден" для валидной Мир карты и подсветить иконку Мир', async () => {
    await page.type('#card-number', '2200000000000053');
    await page.click('button[type="submit"]');
    await page.waitForSelector('#result:not(:empty)', { timeout: 2000 });
    const result = await page.$eval('#result', el => el.textContent);
    const mirIconFilter = await page.$eval('.card-image[data-system="mir"]', el => window.getComputedStyle(el).filter);
    expect(result).toBe('Номер карты подтвержден');
    expect(mirIconFilter).toBe('none');
  });
});