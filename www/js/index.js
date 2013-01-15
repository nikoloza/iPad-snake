const board_colours = ['#333399','#6666cc'];
const snake_colours = ['#ff0000','#ffff00'];
const wall_colours = ['#000000'];
const fruit_colours = ['#00ff00'];

const empty = 0;
const wall = 1;
const up = 2;
const right = 3;
const down = 4;
const left = 5;
const fruit = 6;

const W=64;
const H=64;
const T=30;
const First_T = 1000;

const Max_Fruits = 1;
const Fruit_Delay = 2;
const Length_Per_Food = 6;

const level_walls = [
  "3253010 0"
];

var board = new Array(W*H);
var move_cnt = 0;
var fruit_cnt = 0;
var scores = [0,0,0];

var snake1;
var snake2;

function createRect(c_x,c_y,col)
{
	$('#gameBoard').append('<div id =\'cell' + (W*c_y+c_x) + '\' class=\'boardCell\' style=\'background-color: ' + col + '\'></div>');
}

function x_shift(dir) {
  switch (dir) {
	case right:
	  return 1;
	case left:
	  return -1;
	default:
	  return 0;
  }
}

function y_shift(dir) {
  switch (dir) {
	case down:
	  return 1;
	case up:
	  return -1;
	default:
	  return 0;
  }
}

function GameState()
{
  this.paused = true;
  this.resume = function() {
	this.paused = false;
	this.scheduleMove();
  }
  this.pause = function() {
	this.paused = true;
  }
  this.togglePause = function() {
	if (this.paused) {
	  this.resume();
	} else {
	  this.pause();
	}
  }
  this.scheduleMove = function() {
	if (!this.paused) {
	  	setTimeout('move();',T);
	}
  }
}

var gameState = new GameState();

function snake(x,y,dir,length,col)
{
  this.ex = x;
  this.ey = y;
  this.g = 0; // how much more the snake needs to grow (increases with food eaten, decreases when growing)
  this.c = col; // snake color
  this.moved = true;
  this.sx = x + (length-1)*x_shift(dir)
  this.sy = y + (length-1)*y_shift(dir)
  var i;
  for (i=0; i<length; i++)
  {
	var cur_x = this.ex + i*x_shift(dir);
	var cur_y = this.ey + i*y_shift(dir);
	board[W*cur_y+cur_x] = dir;

	$('#cell' + (W*cur_y+cur_x)).css('background-color',snake_colours[this.c])
  }
}

snake.prototype.tailmove = function()
{
  if (this.g > 0)
  {
	this.g--;
  }
  else
  {
	var temp_ex = ((this.ex + x_shift(board[W*this.ey+this.ex])) + W) % W;
	var temp_ey = ((this.ey + y_shift(board[W*this.ey+this.ex])) + H) % H;

	board[W*this.ey+this.ex] = empty;

	$('#cell'+(W*this.ey+this.ex)).css('background-color',board_colours[(this.ex+this.ey)%2])

	this.ex = temp_ex;
	this.ey = temp_ey;
  }
}

snake.prototype.frontmove = function()
{
  var targ_x = ((this.sx + x_shift(board[W*this.sy+this.sx])) + W) % W;
  var targ_y = ((this.sy + y_shift(board[W*this.sy+this.sx])) + H) % H;
  var targ_type = board[W*targ_y+targ_x];
  switch(targ_type)
  {
	case fruit:
	  this.g += Length_Per_Food;
	  fruit_cnt--;
	  scores[this.c]++;
	case empty:
	  board[W*targ_y+targ_x] = board[W*this.sy+this.sx];

	  $('#cell' +(W*targ_y+targ_x)).css('background-color',snake_colours[this.c])

	  this.sx = targ_x;
	  this.sy = targ_y;
	  this.moved = true;
	  return 1;
	default:
	  scores[3-this.c]+=5;
	  alert("snake "+this.c+" died\nsnake 1 score:"+scores[1]+"\nsnake 2 score:"+scores[2]);
	  return 0;
  }
}

// $(document).ready() {
	$(".arrowButton").click(function() {
		  switch ($(this).attr('id'))
		  {
			case 'bottomTopButton': /* up */
			if (board[W*snake2.sy+snake2.sx] != down && snake2.moved) { board[W*snake2.sy+snake2.sx] = up; snake2.moved = false; }
			  break;
			case 'bottomBottomButton': /* down */
			  if (board[W*snake2.sy+snake2.sx] != up && snake2.moved) { board[W*snake2.sy+snake2.sx] = down; snake2.moved = false; }
			  break;
			case 'bottomLeftButton': /* left */
			  if (board[W*snake2.sy+snake2.sx] != right && snake2.moved) { board[W*snake2.sy+snake2.sx] = left; snake2.moved = false; }
			  break;
			case 'bottomRightButton': /* right */
			  if (board[W*snake2.sy+snake2.sx] != left && snake2.moved) { board[W*snake2.sy+snake2.sx] = right; snake2.moved = false; }
			  break;
			case 'topTopButton': /* W */
			  if (board[W*snake1.sy+snake1.sx] != down && snake1.moved) { board[W*snake1.sy+snake1.sx] = up; snake1.moved = false; }
			  break;
			case 'topBottomButton': /* S */
			  if (board[W*snake1.sy+snake1.sx] != up && snake1.moved) { board[W*snake1.sy+snake1.sx] = down; snake1.moved = false; }
			  break;
			case 'topLeftButton': /* A */
			  if (board[W*snake1.sy+snake1.sx] != right && snake1.moved) { board[W*snake1.sy+snake1.sx] = left; snake1.moved = false; }
			  break;
			case 'topRightButton': /* D */
			  if (board[W*snake1.sy+snake1.sx] != left && snake1.moved) { board[W*snake1.sy+snake1.sx] = right; snake1.moved = false; }
			  break;
			case 'pauseButton': /* P */
			  gameState.togglePause();
			  break;
		  }

	});
// };

function dropFruit()
{
  var f_x;
  var f_y;
  while (true)
  {
	f_x = Math.floor(Math.random()*W);
	f_y = Math.floor(Math.random()*H);
	if (board[W*f_y+f_x] == empty)
	{
	  	board[W*f_y+f_x] = fruit;

		$('#cell'+(W*f_y+f_x)).css('background-color',fruit_colours[0]);

	  	fruit_cnt++;
	  	return 0;
	}
  }
}

function move()
{
  	if (move_cnt % 2 == 0)
  	{
		snake1.tailmove()
		if (snake1.frontmove() == 1) gameState.scheduleMove();
		else new_game();
  	}
  	else
  	{
		snake2.tailmove()
		if (snake2.frontmove() == 1) gameState.scheduleMove();
		else new_game();
  	}

  	move_cnt++;

  	if (move_cnt % Fruit_Delay == 0 && fruit_cnt < Max_Fruits) dropFruit();
}

function makeWalls(level_ind)
{
  var i,j,dir,L,l_cnt,str_ind;
  var wall_string = level_walls[level_ind];


  for (str_ind = 0; wall_string[str_ind] != 0; str_ind += 8)
  {
	dir = wall_string[str_ind] - '0';
	i = (wall_string[str_ind+1] - '0')*10 + (wall_string[str_ind+2] - '0');
	j = (wall_string[str_ind+3] - '0')*10 + (wall_string[str_ind+4] - '0');
	L = (wall_string[str_ind+5] - '0')*10 + (wall_string[str_ind+6] - '0');
	for (l_cnt = 0; l_cnt < L; l_cnt++)
	{
	  var cur_x = (i + l_cnt*x_shift(dir)) % W;
	  var cur_y = (j + l_cnt*y_shift(dir)) % H;
	  board[W*cur_y+cur_x] = wall;

	  $('#cell'+(W*cur_y+cur_x)).css('background-color',wall_colours[0]);

	}
  }
}

function new_game()
{
  	// clean up board
  	var cc_x,cc_y;
  	for (cc_y=0; cc_y<H; cc_y++)
  	{
  		for (cc_x=0; cc_x<W; cc_x++)
		{
	  		board[W*cc_y+cc_x] = empty;
	  		$('#cell'+(W*cc_y+cc_x)).css('background-color',board_colours[(cc_x+cc_y)%2]);
		}
  	}

  	makeWalls(Math.floor(Math.random()*level_walls.length));

  	snake1 = new snake(14,8,down,2,0);
  	snake2 = new snake(W-14,H-8,up,2,1);


  	// randomize the starting player (also randomizes player dying in heads on collision)
  	move_cnt = Math.floor(Math.random()*2);
  
  	fruit_cnt = 0;

  	gameState.moveMethod = move;

  	setTimeout(gameState.resume(),First_T);

}

var app = {
	// Application Constructor
	initialize: function() {

		// setup game board
		var cc_x,cc_y;
		for (cc_y = 0; cc_y < H; cc_y++)
			for (cc_x = 0; cc_x < W; cc_x++)
				createRect(cc_x,cc_y,board_colours[(cc_x+cc_y)%2]);

		new_game();
	},
};