var canvas = document.querySelector("canvas"); 
canvas.width = 640; 	
canvas.height = 640;	

var tileHeight = 64;
var tileWidth = 64;

var surface = canvas.getContext("2d"); 
var uInt;
var map; 
var islandArray = []; 
var scrollSpeed = 4;
var images = []; 
var imgStr = ["water", "island", "gap", "ship"];
const ROWS = 10;
const COLS = 11;

var islandChance = 33;  
var gapMoveChance = 66;
var gapRow = Math.floor(Math.random() * ROWS); 

var player = {img:null, x:128, y:320}; 
var playerSprite = 0; 		
var maxSprites = 4;  		
var spriteCtr = 0; 			
var framesPerSprite = 6;	

createMap(); 

function update() 
{
	
	
	animatePlayer();
	scrollMap();
	checkCollision();
	render(); 
}

function createMap()
{
	for (var i = 0; i < imgStr.length; i++)
	{
		images[i] = new Image();
		images[i].src = "../img/"+imgStr[i]+".png";
	}
	map = []; 
	for (var row = 0; row < ROWS; row++)
	{
		map[row] = []; 
		for (var col = 0; col < COLS; col++)
		{
			var tile = {}; 	  
			tile.x = col*64;  
			tile.y = row*64;  
			tile.img = images[0]; 
			map[row][col] = tile; 
		}
	}
	player.img = images[3];
	uInt = setInterval(update, 33.34); 
}

function animatePlayer()
{
	spriteCtr++; 
	if (spriteCtr == framesPerSprite)
	{
		spriteCtr = 0;
		playerSprite++;
		if (playerSprite == maxSprites)
			playerSprite = 0;
	}
}
function scrollMap()
{
	
	for (var row = 0; row < ROWS; row++)
	{
		for (var col = 0; col < COLS; col++)
		{
			map[row][col].x -= scrollSpeed; 
		}
	}
	if (map[0][0].x <= -64) 
	{
		for (var row = 0; row < ROWS; row++) 
		{
			
			if (islandArray.indexOf(map[row][0]) == 0)
				islandArray.shift(); 
			console.log(islandArray.length); 
			map[row].shift(); 
			var tile = {}; 
			tile.x = (COLS-1)*64;
			tile.y = row*64;
			setTileType(tile, row);	
			map[row].push(tile); 
		}
		
		var randRoll = Math.ceil(Math.random() * 99);
		if (randRoll <= gapMoveChance)
		{
			if (gapRow == 0)
				gapRow++;
			else if (gapRow == ROWS-1)
				gapRow--;
			else
				gapRow += (1 - (Math.floor(Math.random() * 2) * 2)); // 1 or -1
		}
	}
}

function setTileType(t, r) 
{
	
	if (r == gapRow)
		t.img = images[2];
	else
	{
		var randRoll = Math.ceil(Math.random() * 99); 
		if (randRoll <= islandChance)
		{
			t.img = images[1];
			islandArray.push(t);
		}
		else
			t.img = images[0];
	}
}

function checkCollision()
{
	for (var i = 0; i < islandArray.length; i++)
	{
		if (!(player.x+12 > islandArray[i].x+52 ||	
			  player.x+52 < islandArray[i].x+12 ||	
			  player.y+32 > islandArray[i].y+52 ||	
			  player.y+48 < islandArray[i].y+40 ))	
		{
			window.alert("Argh matey, ye ran aground!");
			clearInterval(uInt); 
		}
	}
}

function render()
{
	surface.clearRect(0,0,canvas.width,canvas.height); 
	
	for (var row = 0; row < ROWS; row++)
	{
		for (var col = 0; col < COLS; col++)
		{
			surface.drawImage(map[row][col].img, map[row][col].x, map[row][col].y);
		}
	}
	
	surface.drawImage(player.img,
					  64*playerSprite, 0, 64, 64, 	
					  player.x, player.y, 64, 64);  
}

function movePlayerUp() {
	var newPlayerYPosition = player.y - tileHeight;

	if (newPlayerYPosition >= 0) {
		player.y = newPlayerYPosition;
	}
}

function movePlayerDown() {
	var newPlayerYPosition = player.y + tileHeight;

	if (newPlayerYPosition < 640) {
		player.y = newPlayerYPosition;
	}
}

window.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
	var code = event.code;
	if (code === "ArrowDown") {
		movePlayerDown();
	} else if (code === "ArrowUp") {
		movePlayerUp();
	
	}
	else if (code ==="ArrowLeft") {
		movePlayerLeft();
	}
	else if (code==="ArrowRight") {
		movePlayerRight();
		
		
	}
}



function movePlayerLeft() {
	var newPlayerXPosition = player.x - tileWidth;

	if (newPlayerXPosition >= 0) {
		player.x = newPlayerXPosition;
	}
}

function movePlayerRight() {
	var newPlayerXPosition = player.x + tileWidth;

	if (newPlayerXPosition < 640) {
		player.x = newPlayerXPosition;
	}
}

window.addEventListener("keyleft", handleKeyPress);

