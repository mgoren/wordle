// TO DO (handle multiples):
// when we know a letter exists elsewhere AND it's already in known spot also (yellow e while also green e, meaning we know word must have another e in addition to the known one)
// when it shows letter as somewhere or known and also nowhere, cuz letter is only in there once (grey e and also green/yellow, so we know word has only the one e, not two)

let dictionary, words, known, nowhere, somewhere, elsewhere; // exciting global variables ;)

fetch('https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt')
.then(response => response.text())
.then(data => {
  dictionary = data.split('\n').slice(0,-1);
});

document.addEventListener('DOMContentLoaded', start, false);

function start() {
  const form = document.getElementById('form');
  form.addEventListener('submit', formSubmitted, false);
}

function formSubmitted(evt) {
  evt.preventDefault();
  words = dictionary; // reset every time submit form

  // get inputs
  known = Array.from(document.querySelectorAll('[class=letter-known]')).map(el => el.value);
  nowhere = document.getElementById('nowhere').value.split('');
  elsewhere = []
  elsewhere_inputs = Array.from(document.querySelectorAll('[class=letter-elsewhere]')).map(el => el.value);
  for(input of elsewhere_inputs) {
    elsewhere.push(input.split(''));
  }

  // filter out words that include letters on nowhere list
  if (nowhere.length > 0) {
    words = words.filter(word => !word.match(new RegExp(nowhere.join('|'))))
  }

  // select only words that contain letters known to be somewhere in the word
  somewhere = Array.prototype.concat.apply([], elsewhere);
  for (letter of somewhere) {
    words = words.filter(word => word.match(new RegExp(letter)));
  }
  
  for(let i=0; i<5; i++) {
    // select only words where known letters are in the correct spots
    if (known[i] != '') words = words.filter(word => word[i] == known[i]);
    
    // exclude words where we know letter does not go in that spot
    words = words.filter(word => !elsewhere[i].includes(word[i]));
  }

  document.getElementById('wordle-result').innerHTML = words.join('<br>');
};