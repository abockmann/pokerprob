// see https://caniwin.com/texasholdem/preflop/heads-up.php

// hand rank table
var HR;

// cards

const CARDS = {
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
  
const flip = (data) => Object.fromEntries(
  Object
    .entries(data)
    .map(([key, value]) => [value, key])
  );  

CARDS_INV = flip(CARDS);

const suit_dict = {'s': '\u2660', 'd': '\u2666', 'c': '\u2663', 'h': '\u2665'}
const color_dict = {'s': 'black', 'd': 'blue', 'c': 'green', 'h': 'red'}

class Card {
  constructor(suit, value, card_id, parent_id, face="up") {
    this.suit = suit;
    this.value = value;
    this.card_id = card_id;
    this.parent_id = parent_id;
    this.face = face;

    const parent_element = document.getElementById(this.parent_id);
    
    const card = document.createElement("div");
    card.setAttribute("id", card_id);
    card.setAttribute("class", "card");
    card.setAttribute("style", "--suit_color: " + color_dict[this.suit])
    this.card = card;
    
    const main_suit = document.createElement("div");
    main_suit.setAttribute("class", "main_suit");
    main_suit.innerHTML = suit_dict[this.suit]
    this.main_suit = main_suit;
    
    const left_suit = document.createElement("div");
    left_suit.setAttribute("class", "left_suit");
    left_suit.innerHTML = value + "<br>" + suit_dict[this.suit]
    this.left_suit = left_suit;
    
    const right_suit = document.createElement("div");
    right_suit.setAttribute("class", "right_suit");
    right_suit.innerHTML = value + "<br>" + suit_dict[this.suit]
    this.right_suit = right_suit;
    
    this.card.appendChild(this.main_suit)
    this.card.appendChild(this.right_suit)
    this.card.appendChild(this.left_suit)
    
    parent_element.appendChild(this.card)
    
    // this.face_up()
    // this.face_down()
   
    
  }
    
  face_down() {
    this.card.setAttribute("class", "backside");
    this.main_suit.style.visibility = "hidden";
    this.left_suit.style.visibility = "hidden";
    this.right_suit.style.visibility = "hidden";
  }
  
  face_up() {
    this.card.setAttribute("class", "card");
    this.main_suit.style.visibility = "visible";
    this.left_suit.style.visibility = "visible";
    this.right_suit.style.visibility = "visible";
  }
    
}
		  
  


function choice(size, drawn = new Array(), N=52) {
  // choice function (for drawing N cards without replacement.  If some cards are already drawn, they can be included as an array in the drawn argument)
  if (size > N) {
    throw new Error('size cannot be greater than length of array');
  }
  var indices = new Set(Array.from(drawn).map(i => i - 1));
  while (indices.size < size + drawn.length) {
    index = Math.floor(Math.random() * N);
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

const hole1 = new Card('h', '5', card_id="hole1", parent_id="container", face="up")
const hole2 = new Card('c', 'K', card_id="hole1", parent_id="container", face="up")
const hole3 = new Card('s', '10', card_id="hole1", parent_id="container", face="up")
const hole4 = new Card('d', 'Q', card_id="hole1", parent_id="container", face="up")



}
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

function get_individual_hand_rank(c, river_index) {
    // hand value after the community cards + 2 hole cards
    return HR[HR[river_index+c[0]]+c[1]]
}


function draw_and_rank_hand() {
	cards = choice(7);
	return rank_hand(cards)
}

function get_preflop_win_probability(own_cards, n_players, trials=1000, include_winning_hand_stats=false) {
  var wins = 0;
  var mean_winning_rank = 0;
  var winning_rank = 0;
  var river_index;
  for (let i = 0; i < trials; i++) {
      cards = choice(5 + 2*(n_players-1), own_cards);
	table_cards = cards.slice(0, 5);
	river_index = get_river_index(table_cards);
	own_rank = get_individual_hand_rank(own_cards, river_index);
      test_rank = get_hand_value(table_cards.concat(own_cards));
      console.log(own_rank);
      console.log(test_rank);
      console.log(CARD2FILE[own_cards[0]])
      console.log(CARD2FILE[own_cards[1]])
      console.log(CARD2FILE[table_cards[0]])
      console.log(CARD2FILE[table_cards[1]])
      console.log(CARD2FILE[table_cards[2]])
      console.log(CARD2FILE[table_cards[3]])
      console.log(CARD2FILE[table_cards[4]])
      console.log(['error', 'high card', 'one pair', 'two pair', 'trips', 'straight', 'flush', 'full house', 'quads', 'straight flush'][Math.floor(own_rank >> 12)]);
	if (include_winning_hand_stats) {
		winning_rank = own_rank;
	}
	win = 1
	for (let j = 0; j <= n_players; j++) {
	  player_cards = cards.slice(5+2*j, 5+2*j+2);
	  player_rank = get_individual_hand_rank(player_cards, river_index);
	  if (player_rank >= own_rank) {
	    win = 0
		if (!include_winning_hand_stats) {
		  break;
	      } else {
		  winning_rank = player_rank;
	      }
	  }
	}
	wins += win
	if (include_winning_hand_stats) {
	  mean_winning_rank += winning_rank	
	}
  }
  if (!include_winning_hand_stats) {
    return  wins/trials; // winning percentage
  } else {
    return [wins/trials, mean_winning_rank/trials];
  }
}

function get_hand_type(rank) {
	return ['error', 'high card', 'one pair', 'two pair', 'trips', 'straight', 'flush', 'full house', 'quads', 'straight flush'][rank >> 12]
}




