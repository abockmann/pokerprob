// see https://caniwin.com/texasholdem/preflop/heads-up.php

// hand rank table
var HR;

// number of players
var numPlayers = 10;

// where in the game are we?
var step = "preflop";

// cards

const CARDS = {1: '2c', 2: '2d', 3: '2h', 4: '2s', 5: '3c', 6: '3d', 7: '3h', 8: '3s', 9: '4c', 10: '4d', 11: '4h', 12: '4s', 13: '5c',
               14: '5d', 15: '5h', 16: '5s', 17: '6c', 18: '6d', 19: '6h', 20: '6s', 21: '7c', 22: '7d', 23: '7h', 24: '7s', 25: '8c', 26: '8d',
               27: '8h', 28: '8s', 29: '9c', 30: '9d', 31: '9h', 32: '9s', 33: 'tc', 34: 'td', 35: 'th', 36: 'ts', 37: 'jc', 38: 'jd', 39: 'jh',
               40: 'js', 41: 'qc', 42: 'qd', 43: 'qh', 44: 'qs', 45: 'kc', 46: 'kd', 47: 'kh', 48: 'ks', 49: 'ac', 50: 'ad', 51: 'ah', 52: 'as'};


const suit_dict = {'s': '\u2660', 'd': '\u2666', 'c': '\u2663', 'h': '\u2665'}
const color_dict = {'s': 'black', 'd': 'blue', 'c': 'green', 'h': 'red'}

class Card {
  constructor(cardNum, card_id, parent_id, face="up") {
    
    this.cardNum = cardNum
    this.suit =  CARDS[this.cardNum][1]
    this.value = CARDS[this.cardNum][0].toUpperCase().replace("T", "10")
    this.card_id = card_id;
    this.parent_id = parent_id;
    this.face = face;

    const parent_element = document.getElementById(this.parent_id);
    
    const card = document.createElement("div");
    card.setAttribute("id", card_id);
    card.setAttribute("class", "card");
    card.setAttribute("style", "--suit_color: " + color_dict[this.suit])
    card.setAttribute("cardNum", `${cardNum}`)
    this.card = card;
    
    const main_suit = document.createElement("div");
    main_suit.setAttribute("class", "main_suit");
    main_suit.innerHTML = suit_dict[this.suit]
    this.main_suit = main_suit;
    
    const left_suit = document.createElement("div");
    left_suit.setAttribute("class", "left_suit");
    left_suit.innerHTML = this.value + "<br>" + suit_dict[this.suit]
    this.left_suit = left_suit;
    
    const right_suit = document.createElement("div");
    right_suit.setAttribute("class", "right_suit");
    right_suit.innerHTML = this.value + "<br>" + suit_dict[this.suit]
    this.right_suit = right_suit;
    
    this.card.appendChild(this.main_suit)
    this.card.appendChild(this.right_suit)
    this.card.appendChild(this.left_suit)
    
    parent_element.appendChild(this.card)
    
    if (face == "up") {
      this.face_up();
    } else if (face == "down") {
      this.face_down();
    }
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

function getPlayerCoordinates(numPlayers) {
  w = 105;
  h = 50;
  c0_right = w - h + 0.25*h*Math.PI; // start at right side of table
  c0_middle = 0.5*(w - h); // start at bottom-middle of table
  origin = [32.5,-2.8]

  coords = distributePoints(numPlayers, width=w, height=h, c0=c0_middle, origin=origin);
  myInd = 0; // position of human player

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

function setPlayers(event) {
  numPlayers = Number(event.target.innerHTML);
  deal();
}


// submit button

function deal() {

 ret = getPlayerCoordinates(numPlayers=numPlayers);

 player_coords = ret.coords;
 myInd = ret.myInd;
 // drawHoleCards();
 var table = document.getElementById("table");
 table.innerHTML = '<div class="table_line"></div>';  // clear table
 
  const hand = choice(2);
  const hole1_value = hand[0];
  const hole2_value = hand[1];

  let card_containers = [];
  for (let i = 0; i <  numPlayers; i++) {
    card_containers.push(document.createElement("div"));
    card_containers[i].setAttribute("id", `player_${i}`);
    card_containers[i].setAttribute("class", "card_container");
    card_containers[i].style.left = `${player_coords[i][0]}vh`
    card_containers[i].style.bottom = `${player_coords[i][1]}vh`
    table.appendChild(card_containers[i]);
    if (i == myInd) {
      hole1 = new Card(hole1_value, card_id="hole1", parent_id=`player_${i}`, face="up")
      hole2 = new Card(hole2_value, card_id="hole2", parent_id=`player_${i}`, face="up") 
    } else {
      new Card(1, card_id=`player_${i}_card1`, parent_id=`player_${i}`, face="down")
      new Card(1, card_id=`player_${i}_card2`, parent_id=`player_${i}`, face="down")
    }
  }
  // Deal/Check button functionality
  var submit_button = document.getElementById("submit_button");
  submit_button.innerHTML = "Check"
  submit_button.onclick = check;
}

// Players button functionality
for (let n = 2; n <= 10; n++) {
  var players_choice = document.getElementById(`player${n}`);
  players_choice.onclick = setPlayers;
}

// Mode button functionality
var preflop_mode = document.getElementById("preflop_mode");
var flop_mode = document.getElementById("flop_mode");
var turn_mode = document.getElementById("turn_mode");
var river_mode = document.getElementById("river_mode");
var all_mode = document.getElementById("all_mode");
preflop_mode.onclick = modeSelection;
flop_mode.onclick = modeSelection;
turn_mode.onclick = modeSelection;
river_mode.onclick = modeSelection;
all_mode.onclick = modeSelection;

function modeSelection(event) {
  preflop_mode.innerHTML = "Preflop";
  flop_mode.innerHTML = "Flop";
  turn_mode.innerHTML = "Turn";
  river_mode.innerHTML = "River";
  all_mode.innerHTML = "All";
  event.target.innerHTML +=  " &#x2714"
}



function check() {
 // evaluate existing table and change button back

   var hole1 = document.getElementById("hole1");
   var hole2 = document.getElementById("hole2");
   var v1 = Number(hole1.getAttribute("cardNum"));
   var v2 = Number(hole2.getAttribute("cardNum"));
   var win_prob = get_preflop_win_probability([v1, v2], trials=100000, include_winning_hand_stats=false);
   // debug
   var output = document.getElementById("sliderValue")
   output.innerHTML = `${Math.round(10*100*win_prob)/10}` + "%"; // *10 / 10 is a trick to round to 1 decimal
   
   var slider = document.getElementById("mySlider")
   slider.setAttribute("value", `${100*win_prob}`);
   slider.value = `${100*win_prob}`;

  var submit_button = document.getElementById("submit_button");
  submit_button.innerHTML = "Deal"
  submit_button.onclick = deal;
}


deal()



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

function get_preflop_win_probability(own_cards, trials=1000) {
  var wins = 0;
  var mean_winning_rank = 0;
  var winning_rank = 0;
  var river_index;
  for (let i = 0; i < trials; i++) {
      cards = choice(5 + 2*(numPlayers-1), own_cards);
      table_cards = cards.slice(0, 5);
      river_index = get_river_index(table_cards);
      own_rank = get_individual_hand_rank(own_cards, river_index);
      test_rank = get_hand_value(table_cards.concat(own_cards));
      //console.log(own_rank);
      //console.log(test_rank);
      //console.log(['error', 'high card', 'one pair', 'two pair', 'trips', 'straight', 'flush', 'full house', 'quads', 'straight flush'][Math.floor(own_rank >> 12)]);
      win = 1;
      for (let j = 0; j < (numPlayers-1); j++) {
        player_cards = cards.slice(5+2*j, 5+2*j+2);
        player_rank = get_individual_hand_rank(player_cards, river_index);
        if (player_rank >= own_rank) {
          win = 0
          break;
        }
      }
	wins += win
  }
  return  wins/trials; // winning percentage
}

function get_hand_type(rank) {
	return ['error', 'high card', 'one pair', 'two pair', 'trips', 'straight', 'flush', 'full house', 'quads', 'straight flush'][rank >> 12]
}




