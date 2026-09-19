$(function() {

    // ==========================================
    // 1. ハンバーガーメニューの開閉＆閉じる処理
    // ==========================================
    const nav = document.querySelector('#sp_nav');
    const btn = document.querySelector('.toggle-btn');

    if (btn && nav) {
        // ボタンクリックでトグル
        btn.onclick = () => {
            nav.classList.toggle('open');
        };

        // SPメニュー内のリンクをクリックしたら閉じる
        const navLinks = document.querySelectorAll('#sp_nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
            });
        });
    }


    // ==========================================
    // 2. ページ内スムーススクロール
    // ==========================================
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();

        const href = $(this).attr('href');
        const $target = (href === '#' || href === '') ? $('html') : $(href);

        if ($target.length === 0) return;

        // 80pxの沈み込みを考慮した位置計算
        let position = $target.offset().top;
        if (!$target.hasClass('is-show')) {
            position -= 80; 
        }

        const speed = 400;

        $('html, body').stop(true).animate(
            { scrollTop: position },
            speed,
            'swing',
            function() {
                $target.addClass('is-show');
            }
        );
    });


// ==========================================
// 3. スクロール時のふわっと表示（フェードイン）
// ==========================================
function checkFadeIn() {
    $('.profile, .diary, .gallery, .goods, .contact').each(function() {
        const sectionTop = $(this).offset().top;
        const scroll = $(window).scrollTop();
        const windowHeight = $(window).height();

        if (scroll > sectionTop - windowHeight + 180) {
            $(this).addClass('is-show');
        }
    });
}

// スクロール時およびページ読み込み（リロード）時に実行
$(window).on('scroll load', function() {
    checkFadeIn();
});

// DOM構築完了時（DOMContentLoaded）にも念のため初期判定を実行
checkFadeIn();


// ==========================================
// 4. 日記スライダー（スマホサイズのみ・無限ループ）
// ==========================================
const track = document.querySelector('.diary-items');
const dots = document.querySelectorAll('.carousel-dots .dot');

if (track && track.children.length > 0) {
    const slideCount = track.children.length;
    let currentIndex = 0;
    const intervalTime = 3000;
    let timerId = null;
    let firstClone = null; // クローン保持用

    const mediaQuery = window.matchMedia('(max-width: 768px)');

     function updateDots(index) {
        if (dots.length === 0) return;
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 最後のクローン（複製）を表示しているときは、先頭（0番目）のドットを光らせる
        const targetIndex = index === slideCount ? 0 : index;
        if (dots[targetIndex]) {
            dots[targetIndex].classList.add('active');
        }
       }

    function updateSlide() {
        currentIndex++;
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(-${currentIndex * 81}%)`;

        updateDots(currentIndex);

        // 複製した最後のスライドに到達したらアニメーションなしで先頭に戻す
        if (currentIndex === track.children.length - 1) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = 0;
                track.style.transform = `translateX(0%)`;
            }, 500);
        }
    }

    function startSlider() {
        // スマホ表示時のみクローンを追加する
        if (!firstClone) {
            firstClone = track.children[0].cloneNode(true);
            track.appendChild(firstClone);
        }

        updateDots(0);

        if (!timerId) {
            timerId = setInterval(updateSlide, intervalTime);
        }
    }

    function stopSlider() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }

        // PC表示に戻った際はクローンを削除して元の3つに戻す
        if (firstClone && firstClone.parentNode) {
            track.removeChild(firstClone);
            firstClone = null;
        }

        // 位置とアニメーションをリセット
        currentIndex = 0;
        track.style.transition = 'none';
        track.style.transform = 'translateX(0%)';

        dots.forEach(dot => dot.classList.remove('active'));
    }

    function handleResize(e) {
        if (e.matches) {
            startSlider(); // スマホサイズなら開始＆クローン追加
        } else {
            stopSlider();  // PCサイズなら停止＆クローン削除
        }
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            if (!mediaQuery.matches) return; // スマホサイズじゃなければ無視
            
            // 自動再生を一旦クリアしてタイマーをリセット（クリック直後にすぐ動かないようにするため）
            clearInterval(timerId);
            
            const index = Number(e.target.dataset.index);
            currentIndex = index;
            
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(-${currentIndex * 81}%)`;
            updateDots(currentIndex);
            
            // 再度タイマーをスタート
            timerId = setInterval(updateSlide, intervalTime);
        });
    });


    // 初回判定と画面サイズ変化の監視
    mediaQuery.addEventListener('change', handleResize);
    handleResize(mediaQuery);
}

    // ==========================================
    // 5. ギャラリー画像の拡大表示（モーダル）
    // ==========================================
    $('.gallery-item img').on('click', function(e) {
        e.stopPropagation();
        const imgSrc = $(this).attr('src');
        
        $('#modal-img').attr('src', imgSrc);
        $('#modal').css('display', 'flex').hide().fadeIn(300);
    });

    // モーダル背景または閉じるボタンクリックで閉じる
    $('#modal, .modal-close').on('click', function(event) {
        if (!$(event.target).is('#modal-img')) {
            $('#modal').fadeOut(300);
        }
    });

});