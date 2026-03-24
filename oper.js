document.addEventListener('DOMContentLoaded', () => {
  // ===== БУРГЕР-МЕНЮ =====
  const burgerBtn = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('burger--active');
      navMenu.classList.toggle('header__nav--open');
    });

    navMenu.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('burger--active');
        navMenu.classList.remove('header__nav--open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
        burgerBtn.classList.remove('burger--active');
        navMenu.classList.remove('header__nav--open');
      }
    });
  }

  // ===== ВИДЕОПЛЕЕР =====
  const thumbnail = document.getElementById('videoThumbnail');
  const videoPlayer = document.getElementById('videoPlayer');

  if (!thumbnail || !videoPlayer) return;

  // Скрыть/показать элементы через классы/стили
  const showPlayer = () => {
    thumbnail.style.display = 'none';
    videoPlayer.classList.add('video-section__player--visible');
  };

  const hidePlayer = () => {
    videoPlayer.classList.remove('video-section__player--visible');
    thumbnail.style.display = 'block';
  };

  // Основная функция запуска: включает звук (пользовательский клик), показывает плеер и запускает воспроизведение
  const startPlaybackWithSound = async () => {
    try {
      showPlayer();
      videoPlayer.muted = false; // включаем звук после взаимодействия пользователя
      videoPlayer.volume = 1;    // при желании можно изменить
      await videoPlayer.play();
    } catch (err) {
      // Если play() выбросил — попробуем сначала включить muted=true для успешного старта, затем включить звук по факту взаимодействия
      console.warn('play() error, попытка воспроизведения в muted режиме:', err);
      try {
        videoPlayer.muted = true;
        await videoPlayer.play();
        // воспроизведение запущено в muted — затем снять muted (пользователь уже взаимодействовал)
        videoPlayer.muted = false;
      } catch (err2) {
        console.error('Не удалось воспроизвести видео:', err2);
      }
    }
  };

  // Обработчики взаимодействия (мышь и клавиатура)
  const onActivate = (e) => {
    // Игнорируем вспомогательные клавиши-модификаторы
    if (e instanceof KeyboardEvent) {
      if (!(e.key === 'Enter' || e.key === ' ' || e.code === 'Space')) return;
      e.preventDefault();
    }
    startPlaybackWithSound();
  };

  thumbnail.addEventListener('click', onActivate);
  thumbnail.addEventListener('keydown', onActivate);

  // Вернуть миниатюру после окончания видео
  videoPlayer.addEventListener('ended', hidePlayer);

  // На случай, если пользователь щёлкнул по контейнеру, а не по самому изображению
  const container = document.getElementById('videoContainer');
  if (container && container !== thumbnail) {
    container.addEventListener('click', (e) => {
      // если клик пришёлся не на контролы самого видео — запустить
      if (e.target === container) startPlaybackWithSound();
    });
  }

  // Дебаг: падение селекторов в консоли (удалите в продакшне)
  // console.log('videoThumbnail', thumbnail, 'videoPlayer', videoPlayer);
});
