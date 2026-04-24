// --- ELEMENTLAR ---
const monitor = document.querySelector('.progress-monitor');
const questName = document.getElementById('quest-text');
const optionsContainer = document.querySelector('.options-group');
const imageElement = document.querySelector('.image-section img');

// --- O'ZGARUVCHILAR ---
let allQuestions = [];
let currentIndex = 0;

// 1. Progress monitor (01 dan 20 gacha) yaratish
function createProgressMonitor() {
    monitor.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const step = document.createElement('div');
        step.classList.add('step');
        step.innerText = i < 10 ? `0${i}` : `${i}`;
        monitor.appendChild(step);
    }
}

// 2. JSON dan ma'lumotlarni olish
async function getQuiz() {
    try {
        const response = await fetch('/public/data/questions.json');
        if (!response.ok) throw new Error("Fayl topilmadi!");

        allQuestions = await response.json();
        displayQuestion(currentIndex);
    } catch (error) {
        console.error("Xatolik:", error);
        questName.innerText = "Savollarni yuklashda xatolik yuz berdi.";
    }
}

// 3. Savolni ekranga chiqarish
function displayQuestion(index) {
    if (index >= allQuestions.length) {
        alert("Test yakunlandi!");
        return;
    }

    const currentData = allQuestions[index];

    // Savol matnini yangilash
    questName.innerText = currentData.question;

    // Rasmni yangilash
    if (currentData.image_url) {
        imageElement.src = currentData.image_url;
        imageElement.style.display = 'block';
    } else {
        imageElement.style.display = 'none'; // Rasm yo'q bo'lsa yashirish
    }
    imageElement.onerror = () => {
        imageElement.style.display = 'none';
    };

    // Variantlarni tozalash va yangi qo'shish
    optionsContainer.innerHTML = '';
    currentData.options.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.classList.add('option');
        btn.innerHTML = `<span>${String.fromCharCode(65 + i)}</span> ${option.text}`;

        btn.onclick = () => {
            handleAnswer(option.is_correct, btn);
        };
        optionsContainer.appendChild(btn);
    });

    updateProgressUI(index);
}

// 4. Javobni tekshirish va keyingisiga o'tish
function handleAnswer(isCorrect, clickedBtn) {
    const steps = document.querySelectorAll('.step');

    // Barcha tugmalarni o'chirib qo'yish (ikki marta bosilmasin)
    document.querySelectorAll('.option').forEach(btn => {
        btn.disabled = true;
    });

    if (isCorrect) {
        clickedBtn.classList.add('correct');       // To'g'ri — yashil
        steps[currentIndex].classList.add('completed');
    } else {
        clickedBtn.classList.add('wrong');          // Noto'g'ri — qizil
        steps[currentIndex].classList.add('wrong');

        // To'g'ri javobni ko'rsatish
        document.querySelectorAll('.option').forEach(btn => {
            // To'g'ri javob matnini topish
            const optionText = btn.innerText.slice(2).trim(); // "A text" → "text"
            const correct = allQuestions[currentIndex].options.find(o => o.is_correct);
            if (optionText === correct.text) {
                btn.classList.add('correct');
            }
        });
    }

    // Keyingi savolga o'tish
    setTimeout(() => {
        currentIndex++;
        if (currentIndex < allQuestions.length) {
            displayQuestion(currentIndex);
        } else {
            alert("Siz barcha savollarga javob berdingiz!");
        }
    }, 800);
}

// 5. Monitor holatini yangilash
function updateProgressUI(index) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, i) => {
        step.classList.remove('current');
        if (i === index) step.classList.add('current');
    });
}

// Ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    createProgressMonitor();
    getQuiz();
});