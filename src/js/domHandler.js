import { getPaymentSystem } from './paymentSystem.js';
import { isValidCard } from './cardValidator.js';

export function initCardValidator() {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('card-form');
    const input = document.getElementById('card-number');
    const result = document.getElementById('result');
    const cardImages = document.querySelectorAll('.card-image');

    if (!form || !input || !result || !cardImages.length) {
      console.error('Необходимые элементы DOM не найдены');
      return;
    }

    function resetIcons() {
      cardImages.forEach((img) => {
        img.style.filter = 'grayscale(1)';
      });
    }

    function highlightIcon(system) {
      console.log('Highlighting system:', system); // Логирование для отладки
      resetIcons();
      if (system) {
        const activeImg = document.querySelector(`.card-image[data-system="${system}"]`);
        if (activeImg) {
          activeImg.style.filter = 'none';
        }
      }
    }

    input.addEventListener('input', (e) => {
      const value = e.target.value.replace(/\D/g, '');
      const cleanedValue = value.slice(0, 16);
      e.target.value = cleanedValue;
      console.log('Input value:', cleanedValue); // Логирование ввода
      if (cleanedValue.length >= 4) {
        const system = getPaymentSystem(cleanedValue);
        console.log('Detected system:', system); // Логирование системы
        highlightIcon(system);
      } else {
        resetIcons();
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cardNumber = input.value.replace(/\D/g, '');
      const system = getPaymentSystem(cardNumber);
      result.textContent = '';

      if (cardNumber.length < 13 || cardNumber.length > 16) {
        result.textContent = 'Недействительный номер карты';
        resetIcons();
        return;
      }

      console.log('Validating card:', cardNumber, 'System:', system, 'Valid:', isValidCard(cardNumber)); // Логирование валидации
      if (system && isValidCard(cardNumber)) {
        result.textContent = 'НОМЕР КАРТЫ КОРРЕКТЕН';
        highlightIcon(system);
      } else {
        result.textContent = 'Недействительный номер карты';
        resetIcons();
      }
    });
  });
}