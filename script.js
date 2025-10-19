// === SIGN UP ===
const signForm = document.getElementById('signForm');
if (signForm) {
    signForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            alert('Email sudah terdaftar! Silakan login.');
            window.location.href = 'Login.html';
            return;
        }

        const newUser = {
            id: Date.now(), 
            name,
            email,
            password,
            expEksponen: 0,   
            completed: []     
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', JSON.stringify(newUser));

        alert('Sign up berhasil! Kamu langsung login.');
        window.location.href = 'index.html';
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const matchedUser = users.find(u => u.email === email && u.password === password);

        if (matchedUser) {
            localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
            alert('Login berhasil!');
            window.location.href = 'index.html';
        } else {
            alert('Email atau password salah!');
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const profileDropdown = document.querySelector('ul.navbar-nav.ms-auto .dropdown');
    const signupBtn = document.querySelector('.btn-signup');

    if (loggedInUser && profileDropdown) {

        const profileToggle = profileDropdown.querySelector('.dropdown-toggle');
        profileToggle.innerHTML = `
      <img src="assets/Prof1le.jpg" alt="Profile" width="35" height="35" class="rounded-circle me-2">
      ${loggedInUser.name}
    `;

        const dropdownMenu = profileDropdown.querySelector('.dropdown-menu');
        dropdownMenu.innerHTML = `
      <li><a class="dropdown-item" href="profile.html">My Profile</a></li>
      <li><a class="dropdown-item" href="#">Account</a></li>
      <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Logout</a></li>
    `;

        if (signupBtn) signupBtn.style.display = 'none';

 
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            alert('Kamu sudah logout!');
            window.location.href = 'index.html';
        });

    } else if (profileDropdown) {

        const profileToggle = profileDropdown.querySelector('.dropdown-toggle');
        profileToggle.innerHTML = `
      <img src="assets/Prof1le.jpg" alt="Profile" width="35" height="35" class="rounded-circle me-2">
      Profile
    `;

        const dropdownMenu = profileDropdown.querySelector('.dropdown-menu');
        dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="Signup.html">Sign up / Log in</a></li>
        `;

        if (signupBtn) signupBtn.style.display = 'inline-block';
    }
});

function toggleSidebar() {
    document.getElementById("mobileSidebar").classList.toggle("active");
}


const quizForm = document.getElementById('quizForm');
const quizResult = document.getElementById('quiz-result');
const xpPerCorrect = 25;


const materi2Link = document.getElementById('materi2Link') || document.querySelector('a[href="#materi2"]');
const materi2LinkMobile = document.getElementById('materi2LinkMobile') || null;


function getXpEksponen() {
    return parseInt(localStorage.getItem('xpEksponen') || '0', 10);
}
function setXpEksponen(xp) {
    localStorage.setItem('xpEksponen', String(xp));
}


function disableQuizUI() {
    if (!quizForm) return;
    const inputs = quizForm.querySelectorAll('input[type="radio"]');
    inputs.forEach(i => i.disabled = true);
    const submit = quizForm.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;

    if (!quizForm.querySelector('.done-note')) {
        const doneNote = document.createElement('div');
        doneNote.className = 'done-note mt-3 text-success';
      
        quizForm.parentNode.insertBefore(doneNote, quizForm.nextSibling);
    }
}


function updateLockIcon(link, unlocked) {
    if (!link) return;
    const existingIcon = link.querySelector('i.fa-lock');

    if (unlocked) {
      
        if (existingIcon) existingIcon.remove();
    } else {
       
        if (!existingIcon) {
            link.insertAdjacentHTML("beforeend", ' <i class="fa-solid fa-lock"></i>');
        }
    }
}


function unlockNextMateri() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const xp = user ? (user.expEksponen || 0) : 0;
    const unlocked = xp >= 75;


    if (materi2Link) {
        materi2Link.classList.toggle('disabled', !unlocked);
        updateLockIcon(materi2Link, unlocked);
    }
  
    if (materi2LinkMobile) {
        materi2LinkMobile.classList.toggle('disabled', !unlocked);
        updateLockIcon(materi2LinkMobile, unlocked);
    }

    if (unlocked) disableQuizUI();


    localStorage.setItem('unlocked_materi2', unlocked);
}
document.addEventListener('DOMContentLoaded', unlockNextMateri);


window.addEventListener("load", () => {
    const materi2Unlocked = localStorage.getItem('unlocked_materi2') === 'true';
    if (materi2Link) {
        materi2Link.classList.toggle('disabled', !materi2Unlocked);
        updateLockIcon(materi2Link, materi2Unlocked);
    }
    if (materi2LinkMobile) {
        materi2LinkMobile.classList.toggle('disabled', !materi2Unlocked);
        updateLockIcon(materi2LinkMobile, materi2Unlocked);
    }
});


if (quizForm) {
    const questionsData = [
        { q: "Berapakah hasil dari 2<sup>8</sup> : 2<sup>4</sup> ?", a: ["8", "16", "32"], correct: "16" },
        { q: "Berapakah hasil dari 3<sup>2</sup> . 3<sup>3</sup> ?", a: ["729", "81", "243"], correct: "243" },
        { q: "Hasil dari 2<sup>5</sup> adalah ?", a: ["16", "32", "64"], correct: "32" },
        { q: "Berapakah hasil dari 5<sup>0</sup> ?", a: ["0", "1", "5"], correct: "1" }
    ];

    function shuffleArray(array) { return array.sort(() => Math.random() - 0.5); }
    const shuffledQuestions = shuffleArray([...questionsData]);

    const alreadyXp = getXpEksponen();

    
    if (alreadyXp >= 75) {
        quizForm.innerHTML = `<p style="color:lightgreen">✅ Kamu sudah mendapatkan ${alreadyXp} XP pada materi Eksponen. Materi Logaritma telah terbuka.</p>`;
        disableQuizUI();
    } else {
       
        shuffledQuestions.forEach((item, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.dataset.answer = item.correct;
            questionDiv.style.display = 'none';

            const p = document.createElement('p');
            p.innerHTML = `${index + 1}. ${item.q}`;
            questionDiv.appendChild(p);

            const shuffledAnswers = shuffleArray([...item.a]);
            shuffledAnswers.forEach((ans, i) => {
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q${index + 1}`;
                input.value = ans;
                input.id = `q${index + 1}${i}`;

                const label = document.createElement('label');
                label.htmlFor = input.id;
                label.innerText = " " + ans;

                questionDiv.appendChild(input);
                questionDiv.appendChild(label);
                questionDiv.appendChild(document.createElement('br'));
            });

            quizForm.appendChild(questionDiv);
        });

    
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn btn-success mt-3';
        submitBtn.innerText = 'Submit Jawaban';
        quizForm.appendChild(submitBtn);

  
        let currentQuestion = 0;
        let userAnswers = [];
        let totalXP = 0;
        const questions = quizForm.querySelectorAll('.question');
        if (questions.length) questions[currentQuestion].style.display = 'block';

        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const currentInputName = `q${currentQuestion + 1}`;
            const selectedInput = quizForm.querySelector(`input[name="${currentInputName}"]:checked`);
            const selected = selectedInput ? selectedInput.value : null;
            userAnswers.push(selected);

            if (currentQuestion < questions.length - 1) {
                questions[currentQuestion].style.display = 'none';
                currentQuestion++;
                questions[currentQuestion].style.display = 'block';
            } else {
                quizForm.style.display = 'none';
                let correctCount = 0;
                questions.forEach((q, i) => {
                    if (userAnswers[i] === q.dataset.answer) correctCount++;
                });
                totalXP = correctCount * xpPerCorrect;

            
                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                if (loggedInUser) {
                    
                    loggedInUser.expEksponen = Math.max(loggedInUser.expEksponen || 0, totalXP);

                    if (!loggedInUser.completed.includes('quiz_eksponen')) {
                        loggedInUser.completed.push('quiz_eksponen');
                    }

                    
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const idx = users.findIndex(u => u.email === loggedInUser.email);
                    if (idx !== -1) users[idx] = loggedInUser;
                    localStorage.setItem('users', JSON.stringify(users));
                    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                } else {
                    console.warn("Gagal menambah EXP: tidak ada user login.");
                }


                if (correctCount >= 3) {
                    quizResult.innerHTML = `
                        <h4>🎉 Selamat!</h4>
                        <p>Kamu menjawab benar ${correctCount} dari ${questions.length} soal</p>
                        <p>XP: ${totalXP}</p>
                        <p style="color:limegreen;">Materi selanjutnya kebuka! 🔓</p>
                    `;
                    unlockNextMateri();
                } else {
                    quizResult.innerHTML = `
                        <h4>⚠️ Perlu latihan lagi</h4>
                        <p>Kamu menjawab benar ${correctCount} dari ${questions.length} soal</p>
                        <p>XP: ${totalXP}</p>
                        <p style="color:tomato;">Kumpulin minimal 3 jawaban benar (≥75%) untuk unlock materi berikutnya.</p>
                    `;
                    unlockNextMateri();
                    const restartBtn = document.createElement('button');
                    restartBtn.className = 'btn btn-warning mt-3';
                    restartBtn.innerHTML = '<i class="fa-solid fa-rotate me-2"></i> Ulangi Quiz';
                    restartBtn.onclick = () => window.location.reload();
                    quizResult.appendChild(restartBtn);
                }
            }
        });
    }
}

function getXpEksponen() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    return user ? (user.expEksponen || 0) : 0;
}

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        alert('Kamu belum login!');
        window.location.href = 'Signup.html';
        return;
    }

    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;

    document.getElementById('editProfileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        user.name = document.getElementById('name').value.trim();
        user.email = document.getElementById('email').value.trim();
        user.password = document.getElementById('password').value.trim() || user.password;
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Profil berhasil diperbarui!');
        window.location.reload();
    });
});

