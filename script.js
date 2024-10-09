import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBi0ijQff6zwfQrds8pZz7rhA5CQlxAsVg",
    authDomain: "feira-profissional-cepmacs.firebaseapp.com",
    projectId: "feira-profissional-cepmacs",
    storageBucket: "feira-profissional-cepmacs.appspot.com",
    messagingSenderId: "932351838017",
    appId: "1:932351838017:web:eec597cbf43d8d4ebb83c0",
    measurementId: "G-D2Q1Q5EDHS"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let lastSubmissionTime = 0; // Armazena o timestamp do último envio
let eventId = 1; // Inicializa o ID do evento

async function getNextEventId() {
    const idRef = ref(database, 'eventId');
    const snapshot = await get(idRef);
    if (snapshot.exists()) {
        eventId = snapshot.val(); // Obtém o ID armazenado
    }
    eventId++; // Incrementa o ID
    set(idRef, eventId); // Atualiza o ID no Firebase
}

document.getElementById('eventForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    await getNextEventId(); // Obtém o próximo ID

    const currentTime = Date.now(); // Timestamp atual
    const timeDiff = currentTime - lastSubmissionTime; // Diferença de tempo desde o último envio

    if (timeDiff < 10000) { // Verifica se passou menos de 10 segundos
        alert('Por favor, aguarde um pouco antes de enviar novamente.'); // Mensagem de aviso
        return; // Impede o envio
    }

    // Atualiza o timestamp do último envio
    lastSubmissionTime = currentTime;

    // Capturando valores dos campos do formulário
    const colegio = document.getElementById('colegio').value;
    const email = document.getElementById('email').value;
    const tel = document.getElementById('telefone').value; 
    const alunos = document.getElementById('alunos').value;
    const data = document.getElementById('data').value;

    const eventRef = ref(database, `eventos/${eventId}_${colegio}`);

    set(eventRef, {
        colegio: colegio,
        email: email,
        tel: tel,
        alunos: alunos,
        data: data
    }).then(() => {
        alert('Evento armazenado com sucesso!'); // Mensagem de sucesso
        event.target.reset(); // Limpa o formulário
    }).catch(error => {
        console.error('Erro ao armazenar evento:', error); // Log de erro
    });
});

$(document).ready(function() {
    $('#telefone').inputmask({
        mask: '(99) 99999-9999', // Máscara para telefone com DDD
        placeholder: ' ', // Placeholder com espaço reservado
        showMaskOnHover: false,
        showMaskOnFocus: true,
        clearIncomplete: true
    });
});
