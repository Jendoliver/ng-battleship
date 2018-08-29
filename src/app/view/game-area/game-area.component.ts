import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { BoardService } from '../../service/board.service'
import { Board } from '../../model/board'

declare const Pusher: any;
const NUM_PLAYERS = 2;
const BOARD_SIZE = 6;

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.css'],
  providers: [BoardService]
})
export class GameAreaComponent implements OnInit {

	pusherChannel: any;
canPlay: boolean = true;
player: number = 0;
players: number = 0;
gameId: string;

ngOnInit() {}

constructor(
  private toastr: ToastsManager,
  private _vcr: ViewContainerRef,
  private boardService: BoardService,
) {
  this.toastr.setRootViewContainerRef(_vcr);
  this.createBoards();
  this.initPusher();
  this.listenForChanges();
}

initPusher() : GameAreaComponent {
  // findOrCreate unique channel ID
  let id = this.getQueryParam('id');
  if (!id) {
    id = this.getUniqueId();
    location.search = location.search ? '&id=' + id : 'id=' + id;
  }
  this.gameId = id;
  // init pusher
  var properties = new PropertiesReader('./properties.file'); // TODO solve this shit
  const pusher = new Pusher(properties.path().pusher.key, {
    authEndpoint: properties.path().pusher.endpoint,
    cluster: properties.path().pusher.cluster,
    
  });
  // bind to relevant channels
  this.pusherChannel = pusher.subscribe(id);
  this.pusherChannel.bind('pusher:member_added', member => { this.players++ })
  this.pusherChannel.bind('pusher:subscription_succeeded', members => {
    this.players = members.count;
    this.setPlayer(this.players);
    this.toastr.success("Success", 'Connected!');
  })
  this.pusherChannel.bind('pusher:member_removed', member => { this.players-- });

  return this;
}

listenForChanges() : GameAreaComponent {
  this.pusherChannel.bind('client-fire', (obj) => {
    this.canPlay = !this.canPlay;
    this.boards[obj.boardId] = obj.board;
    this.boards[obj.player].player.score = obj.score;
  });
  return this;
}

setPlayer(players:number = 0) : GameAreaComponent {
  this.player = players - 1;
  if (players == 1) {
    this.canPlay = true;
  } else if (players == 2) {
    this.canPlay = false;
  }
  return this;
}

fireTorpedo(e:any) : GameAreaComponent {
  let id = e.target.id,
    boardId = id.substring(1,2),
    row = id.substring(2,3), col = id.substring(3,4),
    tile = this.boards[boardId].tiles[row][col];
  if (!this.checkValidHit(boardId, tile)) {
    return;
  }

  if (tile.value == 1) {
    this.toastr.success("You got this.", "HURRAAA! YOU SANK A SHIP!");
    this.boards[boardId].tiles[row][col].status = 'win';
    this.boards[this.player].player.score++;
  } else {
    this.toastr.info("Keep trying fam.", "OOPS! YOU MISSED THIS TIME");
    this.boards[boardId].tiles[row][col].status = 'fail'
  }
  this.canPlay = false;
  this.boards[boardId].tiles[row][col].used = true;
  this.boards[boardId].tiles[row][col].value = "X";
  this.pusherChannel.trigger('client-fire', {
    player: this.player,
    score: this.boards[this.player].player.score,
    boardId: boardId,
    board: this.boards[boardId]
  });
  return this;
}

createBoards() : GameAreaComponent {
  for (let i = 0; i < NUM_PLAYERS; i++)
    this.boardService.createBoard(BOARD_SIZE);
  return this;
}

checkValidHit(boardId: number, tile: any) : boolean {
  if (boardId == this.player) {
    this.toastr.error("Don't commit suicide.", "You can't hit your own board.")
    return false;
  }
  if (this.winner) {
    this.toastr.error("Game is over");
    return false;
  }
  if (!this.canPlay) {
    this.toastr.error("A bit too eager.", "It's not your turn to play.");
    return false;
  }
  if(tile.value == "X") {
    this.toastr.error("Don't waste your torpedos.", "You already shot here.");
    return false;
  }
  return true;
}

getQueryParam(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

getUniqueId () {
  return 'presence-' + Math.random().toString(36).substr(2, 8);
}

get boards () : Board[] {
  return this.boardService.getBoards()
}

get winner () : Board {
  return this.boards.find(board => board.player.score >= BOARD_SIZE);
}

get validPlayer(): boolean {
  return (this.players >= NUM_PLAYERS) && (this.player < NUM_PLAYERS);
}

}
