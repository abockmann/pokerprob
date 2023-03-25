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

class Table {
  constructor(num_players) {
    this.num_players = num_players;
  }
}

function searchsorted(arr, value, side='left') {
  // same as numpy's function
  let index = arr.findIndex((x) => x >= value);
  
  if (side === 'left') {
    return index;
  } else if (side === 'right') {
    if (index === -1) {
      return arr.length;
    } else {
      return index;
    }
  } else {
    throw new Error("Invalid side argument. Must be 'left' or 'right'");
  }
}

function get_hextant(c, w, h) {
  // c is the circumferential coordinate starting at the bottom left corner of the middle rectangle, w is the total width and h is the total height.
  rw = w - h; // the width of the middle rectangle
  chc = 0.5*Math.PI*h;
  segments = [rw, chc, rw, chc, rw, chc, rw, chc]
  cumsum = (sum => value => sum += value)(0);
  distance = segments.map(cumsum);
  iseg = searchsorted(distance, c); // the segment the point is in
  if (iseg == 0) { 
    curdist = c;
  } else {
    curdist = c - distance[iseg-1];
  }
  if (iseg > 3) {
    iseg = iseg - 4;
  }
  return { iseg, curdist } // return the index of the current segment (starting form the bottom segment), and the distance travelled along the current segment
}

function get_coord(c, w, h, origin=[0, 0]) {
  // c is the circumferential coordinate
  // origin is the coordinate of the lower straight side of the table at left, just where the curve ends
  hex = get_hextant(c, w, h);
  iseg = hex.iseg;
  curdist = hex.curdist;
  R = 0.5*h;
  let x = Array(2);
  if (iseg == 0) {
    x[0] = curdist;
    x[1] = 0.;
  } else if (iseg == 1) {
    ang = curdist/R;
    x[0] = w - h + R*Math.sin(ang);
    x[1] = R*(1. - Math.cos(ang));
  } else if (iseg == 2) {
      x[0] = w - h - curdist;
      x[1] = h;
  } else if (iseg == 3) {
      ang = curdist/R;
      x[0] = -R*Math.sin(ang);
      x[1] = R*(1. + Math.cos(ang));
  }
  x[0] = x[0] + origin[0];
  x[1] = x[1] + origin[1];
  return x
}

function distributePoints(numPoints, width, height, c0=0, origin=[0,0]) {
  const circumference = 2 * (width - height) + Math.PI * height;
  const deltaCircumference = circumference / numPoints;
  let points = [];
  c = c0;
  for (let i = 0; i < numPoints; i++) {
    x = get_coord(c, width, height, origin=origin)
    c += deltaCircumference;
    points.push(x);
  }
  return points;
}

function getPlayerCoordinates(nPlayers, width, height, c0=0, origin=[0,0]) {
  coords = distributePoints(nPlayers, width, height, c0=c0, origin)
  myInd = 0; // index of human player in the coordinate array
  return { coords, myInd }
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

// remove existing cards
var card_container = document.getElementById("container").innerHTML = ""

hole1 = new Card(CARDS_INV[hole1_value][1], CARDS_INV[hole1_value][0].toUpperCase().replace("T", "10"), card_id="hole1", parent_id="container", face="up")
hole2 = new Card(CARDS_INV[hole2_value][1], CARDS_INV[hole2_value][0].toUpperCase().replace("T", "10"), card_id="hole2", parent_id="container", face="up")
}

function setupTable() {
 w = 90;
 h = 80;
 c0 = w - h + 0.25*h*Math.PI;
 numPlayers = 6;
 ret = getPlayerCoordinates(  numPlayers, width=w, height=h, c0=c0, origin=[45,-3]);

 player_coords = ret.coords;
 myind = ret.myInd;
 // drawHoleCards();
 var table = document.getElementById("table");
 

  let card_containers = [];
  for (let i = 0; i <  numPlayers; i++) {
    card_containers.push(document.createElement("div"));
    card_containers[i].setAttribute("id", `player_${i}`);
    card_containers[i].setAttribute("class", "card_container");
    card_containers[i].style.left = `${player_coords[i][0]}%`
    card_containers[i].style.bottom = `${player_coords[i][1]}%`
    table.appendChild(card_containers[i]);
    new Card(CARDS_INV[1][1], CARDS_INV[2][0].toUpperCase().replace("T", "10"), card_id=`player_${i}_card1`, parent_id=`player_${i}`, face="up")
    new Card(CARDS_INV[2][1], CARDS_INV[3][0].toUpperCase().replace("T", "10"), card_id=`player_${i}_card2`, parent_id=`player_${i}`, face="up")
  }
}



var submit_button = document.getElementById("submit_button");
submit_button.onclick = setupTable;


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




