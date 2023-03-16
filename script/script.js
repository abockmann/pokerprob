// hand rank table
var HR;

// cards

  CARDS = {
    "2c": 1,
    "2d": 2,
    "2h": 3,
    "2s": 4,
    "3c": 5,
    "3d": 6,
    "3h": 7,
    "3s": 8,
    "4c": 9,
    "4d": 10,
    "4h": 11,
    "4s": 12,
    "5c": 13,
    "5d": 14,
    "5h": 15,
    "5s": 16,
    "6c": 17,
    "6d": 18,
    "6h": 19,
    "6s": 20,
    "7c": 21,
    "7d": 22,
    "7h": 23,
    "7s": 24,
    "8c": 25,
    "8d": 26,
    "8h": 27,
    "8s": 28,
    "9c": 29,
    "9d": 30,
    "9h": 31,
    "9s": 32,
    "tc": 33,
    "td": 34,
    "th": 35,
    "ts": 36,
    "jc": 37,
    "jd": 38,
    "jh": 39,
    "js": 40,
    "qc": 41,
    "qd": 42,
    "qh": 43,
    "qs": 44,
    "kc": 45,
    "kd": 46,
    "kh": 47,
    "ks": 48,
    "ac": 49,
    "ad": 50,
    "ah": 51,
    "as": 52
  }
  
CARD2FILE = {
 1: 'CLUB-2.svg',
 2: 'DIAMOND-2.svg',
 3: 'HEART-2.svg',
 4: 'SPADE-2.svg',
 5: 'CLUB-3.svg',
 6: 'DIAMOND-3.svg',
 7: 'HEART-3.svg',
 8: 'SPADE-3.svg',
 9: 'CLUB-4.svg',
 10: 'DIAMOND-4.svg',
 11: 'HEART-4.svg',
 12: 'SPADE-4.svg',
 13: 'CLUB-5.svg',
 14: 'DIAMOND-5.svg',
 15: 'HEART-5.svg',
 16: 'SPADE-5.svg',
 17: 'CLUB-6.svg',
 18: 'DIAMOND-6.svg',
 19: 'HEART-6.svg',
 20: 'SPADE-6.svg',
 21: 'CLUB-7.svg',
 22: 'DIAMOND-7.svg',
 23: 'HEART-7.svg',
 24: 'SPADE-7.svg',
 25: 'CLUB-8.svg',
 26: 'DIAMOND-8.svg',
 27: 'HEART-8.svg',
 28: 'SPADE-8.svg',
 29: 'CLUB-9.svg',
 30: 'DIAMOND-9.svg',
 31: 'HEART-9.svg',
 32: 'SPADE-9.svg',
 33: 'CLUB-10.svg',
 34: 'DIAMOND-10.svg',
 35: 'HEART-10.svg',
 36: 'SPADE-10.svg',
 37: 'CLUB-11-JACK.svg',
 38: 'DIAMOND-11-JACK.svg',
 39: 'HEART-11-JACK.svg',
 40: 'SPADE-11-JACK.svg',
 41: 'CLUB-12-QUEEN.svg',
 42: 'DIAMOND-12-QUEEN.svg',
 43: 'HEART-12-QUEEN.svg',
 44: 'SPADE-12-QUEEN.svg',
 45: 'CLUB-13-KING.svg',
 46: 'DIAMOND-13-KING.svg',
 47: 'HEART-13-KING.svg',
 48: 'SPADE-13-KING.svg',
 49: 'CLUB-1.svg',
 50: 'DIAMOND-1.svg',
 51: 'HEART-1.svg',
 52: 'SPADE-1.svg'
}
  

function choice(size, drawn = new Array(), N=52) {
  // choice function (for drawing N cards without replacement.  If some cards are already drawn, they can be included as an array in the drawn argument)
  if (size > N) {
    throw new Error('size cannot be greater than length of array');
  }
  var indices = new Set(Array.from(drawn).map(i => i - 1));
  while (indices.size < size + drawn.length) {
    const index = Math.floor(Math.random() * N);
    if (!indices.has(index)) {
      indices.add(index);
    }
  }
  const drawn_cards = Array.from(indices).map(i => i + 1);
  return drawn_cards.slice(drawn.length, drawn_cards.length)
}
  

// slider

var slider = document.getElementById("mySlider");
var output = document.getElementById("sliderValue");
output.innerHTML = slider.value + "%";

slider.oninput = function() {
	output.innerHTML = this.value + "%";
}

// submit button

function drawHoleCards() {
// Generate two random integers between 1 and 52 (these can now be the same, which is a bug)
const hand = choice(2)
const hole1_value = hand[0];
const hole2_value = hand[1];

// Create image element for the first random number
const hole1 = document.getElementById("hole1");
const hole2 = document.getElementById("hole2");

hole1.src = "CardFaces/" + CARD2FILE[hole1_value];
hole1.alt = 'Image of card1';
hole2.src = "CardFaces/" + CARD2FILE[hole2_value];
hole2.alt = 'Image of card2';


// Initialize table
//const wasmUrl = 'my-module.wasm';

// Load WebAssembly module
//const wasmModule = WebAssembly.instantiateStreaming(fetch(wasmUrl));

}

// drawHoleCards()
var submit_button = document.getElementById("submit_button");
submit_button.onclick = drawHoleCards;


// Unpack table.dat
async function fetchTable() {
  const tableZipUrl = 'script/HandRanks.zip';
  const tableArrayBuffer = await fetch(tableZipUrl).then(res => res.arrayBuffer());
  const jsZip = await JSZip.loadAsync(tableArrayBuffer);
  const tableData = await jsZip.file('HandRanks.dat').async('arrayBuffer');
  return new Uint32Array(tableData)
}


fetchTable().then(table => {
  // Use the table here...
  HR = table;
}).catch(error => {
  console.error(error);
});

function get_hand_value(c) {
  return HR[HR[HR[HR[HR[HR[HR[53+c[0]]+c[1]]+c[2]]+c[3]]+c[4]]+c[5]]+c[6]]	
}

function get_flop_index(c) {
    // intermediate value after the flop.
    return HR[HR[HR[53+c[0]]+c[1]]+c[2]]
}

function get_turn_index(c) {
    // intermediate value after the turn.
    // returns the index after the community cards
    return HR[HR[HR[HR[53+c[0]]+c[1]]+c[2]]+c[3]]
}

function get_river_index(c) {
    // intermediate value after the river.
    // returns the index after the community cards
    return HR[HR[HR[HR[HR[53+c[0]]+c[1]]+c[2]]+c[3]]+c[4]]
}

function get_individual_hand_rank(h, river_index) {
    // hand value after the community cards + 2 hole cards
    return HR[HR[river_index+h[0]]+h[1]]
}


function draw_and_rank_hand() {
	cards = choice(7);
	return rank_hand(cards)
}

function get_preflop_win_probability(own_cards, n_players, trials=1000) {
  var wins = 0;
  var winning_rank = 0;
  for (let i = 0; i <= trials; i++) {
    cards = choice(5 + 2*n_players, own_cards)
	table_cards = cards.slice(0, 5)
	river_index = get_river_index(table_cards);
	own_rank = get_individual_hand_rank(own_cards, river_index)
	win = 1
	for (let j = 0; j <= n_players; j++) {
	  player_cards = cards.slice(5+2*j, 5+2*j+2)
	  player_rank = get_individual_hand_rank(player_cards, river_index)
	  if (player_rank >= own_rank) {
	    win = 0
		break;
	  }
	}
	wins += win
  }
  return  wins/trials // winning percentage
}

function get_hand_type(rank) {
	return ['error', 'high card', 'one pair', 'two pair', 'trips', 'straight', 'flush', 'full house', 'quads', 'straight flush'][rank >> 12]
}




