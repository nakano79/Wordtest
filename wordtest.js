const wordContainer = document.getElementById('wordContainer');
const resultDiv = document.getElementById('result');
let wordPairs = [];

document.getElementById('csvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const contents = event.target.result;
        const decoder = new TextDecoder('euc-kr');
        const decodedContents = decoder.decode(new Uint8Array(contents));
        parseCSV(decodedContents);
        displayWords();
    };
    reader.readAsArrayBuffer(file);
});

function parseCSV(csvText) {
    wordPairs = [];
    const lines = csvText.split('\n');
    for (const line of lines) {
        if (line.trim() === "") continue;
        const parts = line.split(',');
        if (parts.length >= 2) {
            wordPairs.push({ word: parts[0].trim(), meanings: parts[1].split('/').map(m => m.trim()) });
        }
    }
}

function displayWords() {
    wordContainer.innerHTML = '';
    for (let i = wordPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordPairs[i], wordPairs[j]] = [wordPairs[j], wordPairs[i]];
    }
    let showWord = Math.random() < 0.5;
    for (const pair of wordPairs) {
        const div = document.createElement('div');
        div.className = 'word-pair';
        const input = document.createElement('input');
        const label = document.createElement('label');
        if (showWord) {
            label.textContent = pair.word;
            input.dataset.answer = pair.meanings.join('/');
            input.dataset.type = 'meaning';
        } else {
            label.textContent = pair.meanings.join('/');
            input.dataset.answer = pair.word;
            input.dataset.type = 'word';
        }
        div.appendChild(label);
        div.appendChild(input);
        wordContainer.appendChild(div);
        showWord = !showWord;
    }
}

function checkAnswers() {
    resultDiv.style.display = 'block';
    resultDiv.textContent = '';
    const inputs = document.querySelectorAll('#wordContainer input');
    let correctCount = 0;
    const matchMode = document.querySelector('input[name="matchMode"]:checked').value;

    inputs.forEach(input => {
        const userAnswer = input.value.trim();
        const correctAnswer = input.dataset.answer;
        const correctMeanings = correctAnswer.split('/');

        let isCorrect = false;

        if (matchMode === "partial") {
            isCorrect = correctMeanings.some(meaning => userAnswer === meaning);
        } else {
            isCorrect = correctMeanings.every(meaning => userAnswer.includes(meaning));
        }
        
        if (isCorrect) {
            correctCount++;
            input.classList.remove('wrong');
        } else {
            input.classList.add('wrong');
        }
    });
    resultDiv.textContent = `맞춘 개수: ${correctCount} / ${wordPairs.length}`;
}
