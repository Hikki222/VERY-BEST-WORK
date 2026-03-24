document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // Бургер-меню
    // ===========================
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('overlay');

    const openMenu = () => {
        burgerBtn.classList.add('burger--active');
        navMenu.classList.add('header__nav--open');
        if (overlay) overlay.classList.add('overlay--visible');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        burgerBtn.classList.remove('burger--active');
        navMenu.classList.remove('header__nav--open');
        if (overlay) overlay.classList.remove('overlay--visible');
        document.body.style.overflow = '';
    };

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('header__nav--open');
            isOpen ? closeMenu() : openMenu();
        });

        navMenu.querySelectorAll('.header__nav-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    // ===========================
    // Видеоплеер
    // ===========================
    const thumbnail = document.getElementById('videoThumbnail');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoContainer = document.getElementById('videoContainer');

    if (!thumbnail || !videoPlayer) {
        console.warn('Элементы видеоплеера не найдены');
        return;
    }

    // ✅ Проверяем что видео может загрузиться
    videoPlayer.addEventListener('error', (e) => {
        console.error('Ошибка загрузки видео:', e);
        console.error('Проверь что файл vid.mp4 лежит в папке рядом с index.html');
    });

    // Проверяем ошибки source
    videoPlayer.querySelectorAll('source').forEach(source => {
        source.addEventListener('error', () => {
            console.error('Не удалось загрузить:', source.src);
        });
    });

    const showVideo = () => {
        // ✅ Скрываем картинку
        thumbnail.style.display = 'none';
        // ✅ Показываем видео
        videoPlayer.style.display = 'block';
        videoPlayer.classList.add('video-section__player--visible');
    };

    const hideVideo = () => {
        videoPlayer.style.display = 'none';
        videoPlayer.classList.remove('video-section__player--visible');
        videoPlayer.currentTime = 0;
        // ✅ Возвращаем картинку
        thumbnail.style.display = 'inline-block';
    };

    const startPlayback = async () => {
        showVideo();

        try {
            videoPlayer.muted = false;
            videoPlayer.volume = 1;
            await videoPlayer.play();
        } catch (err) {
            console.warn('Автоплей со звуком заблокирован, пробуем muted:', err);
            try {
                videoPlayer.muted = true;
                await videoPlayer.play();
                // После запуска пробуем включить звук
                setTimeout(() => {
                    videoPlayer.muted = false;
                }, 100);
            } catch (err2) {
                console.error('Не удалось воспроизвести видео:', err2);
                // Видео все равно отображается — пользователь может нажать play вручную
            }
        }
    };

    // Клик по картинке
    thumbnail.addEventListener('click', startPlayback);

    // Клавиатура
    thumbnail.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            startPlayback();
        }
    });

    // Видео закончилось — возвращаем превью
    videoPlayer.addEventListener('ended', hideVideo);

    // Клик по контейнеру (мимо видео и картинки)
    if (videoContainer) {
        videoContainer.addEventListener('click', (e) => {
            if (e.target === videoContainer) {
                startPlayback();
            }
        });
    }

});