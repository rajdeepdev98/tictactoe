var origBoard;
var over=false;
const huplayer='o';
const aiplayer='x';
const wincombos= [

    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]

]

const cells=document.querySelectorAll('.cell');

startgame();
for(var i=0;i<cells.length;i++)console.log(cells[i]);
function startgame(){

    document.querySelector(".endgame").style.display="none";

    origBoard=Array.from(Array(9).keys());
    for(var i=0;i<cells.length;i++){

        cells[i].innerText='';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnclick,false);
    }
    over=false;

}
function turnclick(square){

    // console.log(square.target.id);
    if(typeof (origBoard[square.target.id])==='number'){
        turn(square.target.id,huplayer);
    }
    var chck=checkTie();
    if(!over){
    if(!chck)turn(bestSpot(),aiplayer);
    }
}
function turn(squareid,player){
    origBoard[squareid]=player;
    document.getElementById(squareid).innerText=player;
    let gameWon=checkWin(origBoard,player);
    if(gameWon)gameOver(gameWon);
    
}
function checkWin(board,player){
    let plays=board.reduce((a,e,i)=> (e===player)?a.concat(i) :a, []);
    let gameWon=null;
    for (let [index,win] of wincombos.entries()){
        if(win.every(elem=>plays.indexOf(elem)>-1)){
            gameWon ={index: index,player:player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){

    for (let index of wincombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor=gameWon.player ==huplayer?"blue":"red";

    }
    for(var i=0;i<cells.length;i++){
        cells[i].removeEventListener('click',turnclick,false);
    }
    declareWinner(gameWon.player==huplayer?"You Win!" :"You Lose!");
    over=true;
}

function declareWinner(who){
    document.querySelector(".endgame").style.display="block";
    document.querySelector(".endgame .text").innerText=who;
}
function emptySquares(){

        return origBoard.filter(s=> typeof s==='number');

}
function bestSpot(){
    //return emptySquares()[0];
    return minimax(origBoard,aiplayer).index;
}

function checkTie(){
    if(emptySquares().length===0){
        for(var i=0;i<cells.length;i++){
            cells[i].style.backgroundColor="green";
            cells[i].removeEventListener('click',turnclick,false
            );
        }
        over=true;
        declareWinner("Tie Game!");
        return true;
    }
    return false;
    
}
//Minimax algorithm for the AI
function minimax(newboard,player){
    var availspots=emptySquares(newboard); 
    if(checkWin(newboard,huplayer)){
        return {score :-10};
    }
    else if(checkWin(newboard,aiplayer)){
        return {score : 20};
    }
    else if(availspots.length===0){
        return {score :0};
    }
    var moves=[];
    for(var i=0;i<availspots.length;i++){

        var move={};
        move.index=newboard[availspots[i]];
        newboard[availspots[i]]=player;
        if(player===aiplayer){
            var result=minimax(newboard,huplayer);
            move.score=result.score;
        }
        else{

            var result=minimax(newboard,aiplayer);
            move.score=result.score;
        }
        newboard[availspots[i]]=move.index;
        moves.push(move);
    }

        //finding the best score
        //If AI is playing return highest score else return lowest score(obviously I want the ai to be optimal)

        var bestMove;
        if(player===aiplayer){
            var bestscore=-10000;
            for(var i=0;i<moves.length;i++){
                if(moves[i].score>bestscore){
                    bestscore=moves[i].score;
                    bestMove=i;
                }
            }
        
        }
        else{

            var bestscore=10000;
            for(var i=0;i<moves.length;i++){
                if(moves[i].score<bestscore){
                    bestscore=moves[i].score;
                    bestMove=i;
                }
            }
        }
        return moves[bestMove];
     
}
