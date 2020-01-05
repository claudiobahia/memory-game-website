const cardboard = document.querySelector('#cardboard');
const btnNovoJogo = document.querySelector('#btnNovoJogo')
const btnPlacar = document.querySelector('#btnPlacar');
btnNovoJogo.onclick = iniciarNovaPartida;
btnPlacar.onclick = showMelhorTempo;
const imagens = [
    '../images/facebook.png',
    '../images/android.png',
    '../images/chrome.png',
    '../images/firefox.png',
    '../images/html5.png',
    '../images/googleplus.png',
    '../images/twitter.png',
    '../images/windows.png',
];

let cardHTML = '';

imagens.forEach(img => {
    cardHTML += `
        <div class="card" data-card=${img}>
            <img class="front" src="${img}"/>
            <img class="back" src="../images/cross.png"/>
        </div>
        <div class="card" data-card=${img}>
            <img class="front" src="${img}"/>
            <img class="back" src="../images/cross.png"/>
        </div>
        `
});

cardboard.innerHTML = cardHTML;

const cards = document.querySelectorAll('.card');
let card_um, card_dois;
let travarCard = false;
let cardsClicados = [];
let tempoInicio, tempoFinal;
let melhorTempo = localStorage.getItem('melhortempo') || 0;

function selecionarCard() {
    if (travarCard) return false;
    this.classList.add('flip');
    if (!card_um) {
        card_um = this;
        return false;
    }
    card_dois = this;
    verificandoParidade();
}

function verificandoParidade() {
    let isEqual = card_um.dataset.card === card_dois.dataset.card;
    !isEqual ? deselecionarCard() : limparCardsSelecionados(isEqual);
}

function deselecionarCard() {
    travarCard = true;
    setTimeout(() => {
        card_um.classList.remove('flip');
        card_dois.classList.remove('flip');
        limparCardsSelecionados();
    }, 1000);

}

function limparCardsSelecionados(isEqual = false) {
    if (isEqual) {
        cardsClicados.push(card_um);
        cardsClicados.push(card_dois);
        card_um.removeEventListener('click', selecionarCard);
        card_dois.removeEventListener('click', selecionarCard);
        if (cardsClicados.length === 16) {
            ganhou();
        }
    }
    [card_um, card_dois, travarCard] = [null, null, false];
}

function ordenarCards() {
    cards.forEach(card => {
        let random = Math.floor(Math.random() * 16);
        card.style.order = random;
    });
}

(function desvirarCards() {
    cards.forEach(card => {
        card.classList.add('flip');
    });
})();

function ganhou() {
    if (cardsClicados.length === 16) {
        tempoFinal = (((performance.now() - tempoInicio) % 60000) / 1000).toFixed(0);
        window.alert('Parabéns, você completou o desafio em: ' + tempoFinal + ' segundos.');
        if (typeof (melhorTempo) == 'undefined') {
            localStorage.setItem('melhortempo', tempoFinal)
            melhorTempo = tempoFinal;
        }
        if (tempoFinal < melhorTempo) {
            localStorage.setItem('melhortempo', tempoFinal);
            melhorTempo = tempoFinal;
        }
    }
}

function showMelhorTempo() {
    window.alert(`Melhor tempo = ${melhorTempo} segundos.`)
}

function virarCards() {
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('flip');
        });
    }, 3000);
}

function iniciarNovaPartida() {
    if (cardsClicados.length === 0 || cardsClicados.length === 16) {
        limparCardsSelecionados();
        ordenarCards();
        tempoInicio = performance.now();
        setTimeout(() => {
            cards.forEach(card => card.addEventListener('click', selecionarCard));
            virarCards();
        }, 1000);
    } else window.alert('Há uma partida já em curso!');
}