const pocetniProzor = document.getElementById("pocetniprozor");
const dugmeStart = document.getElementById("dugmestart");
const drugiProzor = document.getElementById("drugiprozor");
const dugmePocetak = document.getElementById("dugmepocetak");
const video2 = document.getElementById("video2");
const canvas2 = document.getElementById("canvas2");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const brojac = document.getElementById("brojac");
const igrabrojac = document.getElementById("igrabrojac");
const igrapoeni = document.getElementById("igricapoeni");
const zvukpobjeda = document.getElementById("zvukpobjede");
const zvukporaz = document.getElementById("zvukporaza");


let timerinterval = null;
let poeni = 0;
let aktivna = false;

//glavna loptica
let lx = 200, ly = 250, lr = 100;
let trenutnaBoja = "white";

function lopta() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.beginPath();
    ctx2.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx2.fillStyle = trenutnaBoja;
    ctx2.fill();
}

//dugmad za pocetak
dugmeStart.addEventListener("click", () => {
    pocetniProzor.style.display = "none";
    drugiProzor.style.display = "flex";
    video2.style.display = "block";
    lopta();
});

dugmePocetak.addEventListener("click", () => {
    drugiProzor.style.display = "none";
    igrabrojac.style.display = "block"; 
    igrapoeni.textContent = poeni;
    igrica();
});


function promijeniboju(boja) {
    trenutnaBoja = boja;
    lopta();
}

let x, y, r;
let misx = 0, misy = 0;
let maleLoptice = [];
let interval = null;

canvas.width = 800;
canvas.height = 500;
canvas2.width = 800;
canvas2.height = 500;

//pracenje misa
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    misx = (e.clientX - rect.left) * scaleX;
    misy = (e.clientY - rect.top) * scaleY;
});

function stvoriLopticu() {
    let pokusaji = 0;

    while (pokusaji < 50) {
        //velicina loptice
        let velike = false;
        if (Math.random() < 0.35) {
            velike = true;
        }

        //poluprecnik
        let poluprecnik;
        if (velike) {
            poluprecnik = Math.random() * 50 + 40; 
        } else {
            poluprecnik = Math.random() * 15 + 8;
        }

        
        let pozX = Math.random() * canvas.width;
        let pozY = Math.random() * canvas.height;

        //udaljenost od glavne loptice
        let udaljenost = Math.hypot(pozX - x, pozY - y);
        if (udaljenost < r + poluprecnik + 80) {
            pokusaji++;
            continue; 
        }

        //provjera sudara
        let sudar = false;
        for (let lopta of maleLoptice) {
            if (Math.hypot(pozX - lopta.x, pozY - lopta.y) < lopta.r + poluprecnik + 20) {
                sudar = true;
                break;
            }
        }
        if (sudar) {
            pokusaji++;
            continue;
        }

        //ako je sve u redu, stvori opticu
        return {
            x: pozX,
            y: pozY,
            r: poluprecnik,
            brzinaX: (Math.random() - 0.5) * 2.5,
            brzinaY: (Math.random() - 0.5) * 2.5,
            boja: `hsl(${Math.random() * 360},70%,50%)`
        };
    }

    return null;
}


//pocetak igrice
function igrica() {
    aktivna = true;
    poeni = 0;
    brojac.textContent = poeni;
    igrapoeni.textContent = poeni;

    const timer = document.getElementById("timer");
    const cetvrtiprozor = document.getElementById("cetvrtiprozor");
    const dugmerestart2 = document.getElementById("dugmerestart2");
    const dugmepocetak3 = document.getElementById("dugmepocetak3");

    if (timerinterval) clearInterval(timerinterval);

  function starttimer() {
    let vrijeme = 40;
    timer.textContent = "00:40";
    timerinterval = setInterval(() => {
        if (!aktivna) return;
        vrijeme--;
        if (vrijeme === 25) pokrenispecijalni();
        
        let min = Math.floor(vrijeme / 60);
        let sek = vrijeme % 60;

        
        if (min < 10) {
            timer.textContent = "0" + min + ":";
        } else {
            timer.textContent = min + ":";
        }

        if (sek < 10) {
            timer.textContent += "0" + sek;
        } else {
            timer.textContent += sek;
        }

        igrapoeni.textContent = poeni;

        if (vrijeme <= 0) {
            clearInterval(timerinterval);
            if (aktivna) {
                aktivna = false;
                zvukpobjeda.currentTime = 0;
                zvukpobjeda.play();
                cetvrtiprozor.style.display = "flex";
                igrabrojac.style.display = "none";
            }
        }
    }, 1000);
}

    dugmerestart2.addEventListener("click", () => {
        cetvrtiprozor.style.display = "none";
        igrica();
    });
    dugmepocetak3.addEventListener("click", () => {
        cetvrtiprozor.style.display = "none";
        drugiProzor.style.display = "flex";
    });

    // inicijalizacija glavne loptice
    x = canvas.width / 2;
    y = canvas.height / 2;
    r = 20;
    misx = x;
    misy = y;
    maleLoptice = [];

    //nove loptice
    interval = setInterval(() => {
        if (!aktivna) return;
        const lopta = stvoriLopticu();
        if (lopta) maleLoptice.push(lopta);
    }, 1000);

    glavnaIgrica();
    starttimer();
}

//glavna funckija
function glavnaIgrica() {
    if (!aktivna) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //kretanje loptice ka misu
    let razlikaX = misx - x;
    let razlikaY = misy - y;
    x += razlikaX * 0.08;
    y += razlikaY * 0.08;

    //male loptice
    maleLoptice.forEach((lopta, index) => {
        lopta.x += lopta.brzinaX;
        lopta.y += lopta.brzinaY;

        //odbijanje od zidove
        if (lopta.x < lopta.r) { lopta.x = lopta.r; lopta.brzinaX *= -1; }
        if (lopta.x > canvas.width - lopta.r) { lopta.x = canvas.width - lopta.r; lopta.brzinaX *= -1; }
        if (lopta.y < lopta.r) { lopta.y = lopta.r; lopta.brzinaY *= -1; }
        if (lopta.y > canvas.height - lopta.r) { lopta.y = canvas.height - lopta.r; lopta.brzinaY *= -1; }

        if (aktivna) lopta.r += 0.01;

        //sudar s glavnom loptom
        let udaljenost = Math.hypot(x - lopta.x, y - lopta.y);
        if (udaljenost < r + lopta.r) {
            if (r > lopta.r) {
                maleLoptice.splice(index, 1);
                poeni += specijalnisataktivan ? 2 : 1;
                r += lopta.r * (lopta.r < 25 && specijalnisataktivan ? 0.24 : 0.12);
                brojac.textContent = poeni;
                igrapoeni.textContent = poeni;
            } else {
                kraj();
            }
        }
    });

    if (r > canvas.width * 0.45) {
        kraj();
    }

    //crtanje glavne lopte
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = trenutnaBoja;
    ctx.fill();

    //crtanje malih loptica
    maleLoptice.forEach(lopta => {
        ctx.beginPath();
        ctx.arc(lopta.x, lopta.y, lopta.r, 0, Math.PI * 2);
        ctx.fillStyle = lopta.boja;
        ctx.fill();
    });

    requestAnimationFrame(glavnaIgrica);
}

//dark mode
const darkmode = document.getElementById("darkmode");
let dugmedarkmode = false;
darkmode.addEventListener("click", () => {
    dugmedarkmode = !dugmedarkmode;
    document.body.classList.toggle("dark-mode", dugmedarkmode);
    trenutnaBoja = dugmedarkmode ? "yellow" : "white";
    darkmode.textContent = dugmedarkmode ? "Dark" : "Light";
    lopta();
});

//zvuk
const dugmezvuk = document.getElementById("sound");
const zvuk = document.getElementById("zvuk");
let zvukon = false;
dugmezvuk.addEventListener("click", () => {
    zvukon = !zvukon;
    if (zvukon) { zvuk.play(); dugmezvuk.textContent = "OFF"; }
    else { zvuk.pause(); dugmezvuk.textContent = "ON"; }
});

//kraj igre
const treciprozor = document.getElementById("treciprozor");
const dugmerestart = document.getElementById("dugmerestart");
const dugmepocetak2 = document.getElementById("dugmepocetak2");

function kraj() {
    aktivna = false;
    clearInterval(interval);
    zvukporaz.currentTime = 0;
    zvukporaz.play();

    setTimeout(() => {
        drugiProzor.style.display = "none";
        treciprozor.style.display = "flex";
    }, 200);

    clearTimeout(specijalnisat);
    specijalnisataktivan = false;
    specijalnisat.style.display = "none";

    igrabrojac.style.display = "none";
}

dugmerestart.addEventListener("click", () => {
    treciprozor.style.display = "none";
    igrica();
});
dugmepocetak2.addEventListener("click", () => {
    treciprozor.style.display = "none";
    drugiProzor.style.display = "flex";
});

//specijalni sat
let specijalnisataktivan = false;
let sattimer = null;
const specijalnisat = document.getElementById("specijalnisat");
const efekat = document.getElementById("efekat");

function pokrenispecijalni() {
    specijalnisat.style.display = "flex";
    efekat.currentTime = 0;
    efekat.play();
    setTimeout(() => {
        specijalnisat.style.display = "none";
        specijalnisataktivan = true;
        sattimer = setTimeout(() => {
            specijalnisataktivan = false;
        }, 5000);
    }, 1500);
}

