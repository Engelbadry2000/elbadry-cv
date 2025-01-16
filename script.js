// تحميل مكتبة jsPDF
const { jsPDF } = window.jspdf;

// العناصر المطلوبة
const phraseInput = document.getElementById('phraseInput');
const downloadBtn = document.getElementById('downloadBtn');
const errorMessage = document.getElementById('errorMessage');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const contactBtn = document.getElementById('contactBtn');
const contactModal = document.getElementById('contactModal');
const closeModal = document.querySelector('.close');
const copyEmailBtn = document.getElementById('copyEmailBtn');
const copyWhatsAppBtn = document.getElementById('copyWhatsAppBtn');
const celebration = document.getElementById('celebration');
const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const googleSearchResults = document.getElementById('googleSearchResults');
const googleResults = document.getElementById('googleResults');
const infoCards = document.querySelectorAll('.info-card');

// التحقق من العبارة المدخلة
if (phraseInput && downloadBtn && errorMessage) {
    phraseInput.addEventListener('input', () => {
        if (phraseInput.value.trim() === "فلسطين حرة") {
            downloadBtn.disabled = false;
            errorMessage.style.display = 'none';
        } else {
            downloadBtn.disabled = true;
            errorMessage.style.display = 'block';
        }
    });
}

// إنشاء ملف PDF
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const container = document.querySelector('.container');
        const pageHeight = 297; // ارتفاع صفحة A4 بالميليمتر

        showToast('جاري إنشاء الملف...');

        html2canvas(container, {
            scale: 2,
            scrollY: -window.scrollY,
            allowTaint: true,
            useCORS: true
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // عرض صفحة A4 بالميليمتر
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = 0;

            while (position < imgHeight) {
                pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
                position += pageHeight;

                if (position < imgHeight) {
                    pdf.addPage();
                }
            }

            pdf.save('Mohamed_Ahmed_Hassan_CV.pdf');
            showToast('تم إنشاء الملف بنجاح!');
        }).catch(error => {
            console.error('Error generating PDF:', error);
            showToast('حدث خطأ أثناء إنشاء الملف.');
        });
    });
}

// التواصل مع المبرمج
if (contactBtn && contactModal && closeModal && copyEmailBtn && copyWhatsAppBtn && celebration) {
    contactBtn.addEventListener('click', () => {
        contactModal.style.display = 'block';
        startCelebration();
    });

    closeModal.addEventListener('click', () => {
        contactModal.style.display = 'none';
        startCelebration();
    });

    copyEmailBtn.addEventListener('click', () => {
        const email = document.getElementById('developerEmail').innerText;
        navigator.clipboard.writeText(email).then(() => {
            showToast('تم نسخ البريد الإلكتروني بنجاح!');
        });
    });

    copyWhatsAppBtn.addEventListener('click', () => {
        const whatsappLink = document.getElementById('developerWhatsApp').innerText;
        navigator.clipboard.writeText(whatsappLink).then(() => {
            showToast('تم نسخ رابط الواتساب بنجاح!');
        });
    });
}

// بدء الاحتفالية
function startCelebration() {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    const duration = 2000;

    for (let i = 0; i < 20; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.top = `${Math.random() * 100}%`;
        firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        celebration.appendChild(firework);

        animateFirework(firework, duration);
    }

    celebration.style.display = 'block';
    setTimeout(() => {
        celebration.innerHTML = '';
        celebration.style.display = 'none';
    }, duration);
}

// تحريك المفرقعات
function animateFirework(firework, duration) {
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            const scale = progress * 3;
            const opacity = 1 - progress;
            firework.style.transform = `scale(${scale})`;
            firework.style.opacity = opacity;
            requestAnimationFrame(update);
        } else {
            firework.remove();
        }
    }

    requestAnimationFrame(update);
}

// تبديل الوضع الليلي والنهاري
if (themeToggle && body) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// تفعيل شريط البحث
if (searchIcon && searchBar && searchInput && searchResults) {
    searchIcon.addEventListener('click', () => {
        searchBar.classList.toggle('active');
        searchInput.focus();
    });

    document.addEventListener('click', (event) => {
        if (!searchBar.contains(event.target) && !searchIcon.contains(event.target)) {
            searchBar.classList.remove('active');
            searchResults.style.display = 'none';
        }
    });

    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        const query = searchInput.value.trim().toLowerCase();
        const resultsList = searchResults.querySelector('ul');
        resultsList.innerHTML = '';

        if (query) {
            searchTimeout = setTimeout(() => {
                // البحث في جوجل
                searchGoogle(query).then(googleResults => {
                    if (googleResults && googleResults.length > 0) {
                        googleResults.forEach(result => {
                            const li = document.createElement('li');
                            li.innerHTML = `
                                <a href="${result.link}" target="_blank" style="color: #3498db; text-decoration: none;">
                                    🌐 ${result.title}
                                </a>
                                <p style="color: #666; font-size: 0.9em;">${result.snippet}</p>
                            `;
                            resultsList.appendChild(li);
                        });
                    } else {
                        const li = document.createElement('li');
                        li.textContent = "🌐 لا توجد نتائج من جوجل";
                        resultsList.appendChild(li);
                    }
                }).catch(error => {
                    console.error('Error fetching Google results:', error);
                    const li = document.createElement('li');
                    li.textContent = "🌐 تعذر الاتصال بجوجل";
                    resultsList.appendChild(li);
                });

                searchResults.style.display = 'block';
            }, 500); // تأخير البحث لـ 500 مللي ثانية
        } else {
            searchResults.style.display = 'none';
        }
    });
}

// البحث في جوجل باستخدام Google Custom Search API
async function searchGoogle(query) {
    const apiKey = 'AIzaSyDskUYjH09dyzwv1d7H_SeTbH8_WmqXzuw'; // استبدل بمفتاح API الخاص بك
    const searchEngineId = 'e100245bc7ebd47a0'; // استبدل بمعرف محرك البحث الخاص بك
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${searchEngineId}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items) {
            return data.items.map(item => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching Google results:', error);
        return [];
    }
}

// عرض رسائل التأكيد
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// عرض تاريخ اليوم
function displayCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('ar-EG', options);
    }
}

// عرض الطقس
async function displayWeather() {
    const weatherElement = document.getElementById('weather-info');
    if (weatherElement) {
        const apiKey = '2757d738851bad02413acc24bac3e59d'; // استبدل بمفتاح API الخاص بك
        const city = 'Qalyub';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ar`;

        weatherElement.innerHTML = '<p>جاري تحميل بيانات الطقس...</p>';

        try {
            const response = await fetch(url);
            const data = await response.json();
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            weatherElement.innerHTML = `
                <p><strong>الطقس:</strong> ${weatherDescription}</p>
                <p><strong>درجة الحرارة:</strong> ${temperature}°C</p>
                <p><strong>الرطوبة:</strong> ${humidity}%</p>
                <p><strong>سرعة الرياح:</strong> ${windSpeed} م/ث</p>
            `;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherElement.innerHTML = '<p>تعذر تحميل بيانات الطقس.</p>';
        }
    }
}

// تحديث الطقس كل 10 دقائق
setInterval(displayWeather, 600000);

// عرض الموقع الحالي
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
}

// عرض تاريخ اليوم والطقس عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate();
    displayWeather();
    getLocation();

    // تأثير التصغير عند التمرير
    function handleScroll() {
        infoCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (cardPosition < screenPosition) {
                card.classList.add('scrolled');
            } else {
                card.classList.remove('scrolled');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
});