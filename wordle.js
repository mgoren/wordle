// TO DO (handle multiples):
// when we know a letter exists elsewhere AND it's already in known spot also (yellow e while also green e, meaning we know word must have another e in addition to the known one)
// when it shows letter as somewhere or known and also nowhere, cuz letter is only in there once (grey e and also green/yellow, so we know word has only the one e, not two)

// exciting global variables ;)
let [words, known, nowhere, somewhere] = [[],[],[],[]];
let elsewhere = [[],[],[],[],[]];

fetch_dictionary();

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.getElementById('toggle-colors').textContent = 'Light Theme';
    document.getElementById('toggle-colors').classList.toggle('btn-dark');
    document.getElementById('toggle-colors').classList.toggle('btn-light');
  }
  document.getElementById('toggle-colors').addEventListener('click', toggle_colors, false);  
  document.getElementById('form').addEventListener('submit', form_submitted, false);
  document.getElementById('restart').addEventListener('click', restart, false);  
  document.querySelectorAll('input').forEach(field => {
    field.addEventListener('input', lowercase);
  });
  document.querySelectorAll('.letter').forEach(field => {
    field.addEventListener('input', advance_to_next_tab);
  });
});

function form_submitted(evt) {
  evt.preventDefault();
  getInput();
  exclude_words_containing_nowhere_letters();
  select_words_containing_somewhere_letters();
  select_words_where_locations_known();
  exclude_words_where_letter_goes_elsewhere();
  document.getElementById('wordle-result').innerHTML = words.join('  ');
};

function exclude_words_containing_nowhere_letters() {
  if (nowhere.length > 0) {
    words = words.filter(word => !word.match(new RegExp(nowhere.join('|'))))
  }
}

function select_words_containing_somewhere_letters() {
  for (letter of somewhere) {
    words = words.filter(word => word.match(new RegExp(letter)));
  }  
}

function select_words_where_locations_known() {
  for(let i=0; i<5; i++) {
    if (known[i] != '') words = words.filter(word => word[i] == known[i]);    
  }
}

function exclude_words_where_letter_goes_elsewhere() {
  for(let i=0; i<5; i++) {
    words = words.filter(word => !elsewhere[i].includes(word[i]));
  }
}

function getInput() {
  const knownFields = document.querySelectorAll('.letter-known');
  const nowhereField = document.getElementById('nowhere');
  const elsewhereFields = document.querySelectorAll('.letter-elsewhere');
  const nowhereInfoBox = document.getElementById('nowhereInfo');

  known = Array.from(knownFields).map(el => el.value);
  nowhere = unique_sorted(nowhere.concat(nowhereField.value.split('')));
  let elsewhere_inputs = Array.from(elsewhereFields);
  for(let i=0; i<elsewhere_inputs.length; i++) {
    elsewhere[i] = unique_sorted(elsewhere[i].concat(elsewhere_inputs[i].value.split('')));
    elsewhere_inputs[i].value = '';
  }
  somewhere = unique_sorted(Array.prototype.concat.apply([], elsewhere));
  nowhereField.value = '';

  for (el in elsewhere) {
    document.getElementById('elsewhereInfo' + (parseInt(el) + 1)).textContent = elsewhere[el].join(' ').toLocaleUpperCase();
  }
  nowhereInfoBox.textContent = nowhere.join(' ').toLocaleUpperCase();
  document.getElementById('output').style.setProperty('display', "initial");
}

function fetch_dictionary() {
  fetch('https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt')
  .then(response => response.text())
  .then(data => {
    words = data.split('\n').slice(0,-1);
  });
}

function restart() {
  if (confirm('Really start over???')) {
    window.location.reload();
  }
}

function advance_to_next_tab(e) {
  let next_field = '';
  if (e.target.value.match(/[a-z]/i)) {
    if (e.target.id == 'letter10') {
      next_field = 'nowhere';
    } else {
      next_field = 'letter' + (parseInt(e.target.id.slice(-1)) + 1);
    }
    document.getElementById(next_field).focus();
  }
}

function lowercase(e) {
  e.target.value = e.target.value.toLocaleLowerCase();
}

function toggle_colors() {
  let body = document.getElementById('body');
  let button = document.getElementById('toggle-colors');
  body.classList.toggle('dark-theme');
  body.classList.toggle('light-theme');
  button.classList.toggle('btn-dark');
  button.classList.toggle('btn-light');
  button.textContent = button.textContent == 'Dark Theme' ? 'Light Theme' : 'Dark Theme'
}

function unique_sorted(array) {
  return Array.from([...new Set(array)]).sort();
}