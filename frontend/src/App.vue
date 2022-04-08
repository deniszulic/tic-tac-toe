<template>
  <div class="container">
    <h1>Tic Tac Toe</h1>
    <h2>{{ alldata.slice(-1) }}</h2>
    <div class="play-area">
      <div id="block_0" class="block" @click="draw(0, false)">
        {{ content[0] }}
      </div>
      <div id="block_1" class="block" @click="draw(1, false)">
        {{ content[1] }}
      </div>
      <div id="block_2" class="block" @click="draw(2, false)">
        {{ content[2] }}
      </div>
      <div id="block_3" class="block" @click="draw(3, false)">
        {{ content[3] }}
      </div>
      <div id="block_4" class="block" @click="draw(4, false)">
        {{ content[4] }}
      </div>
      <div id="block_5" class="block" @click="draw(5, false)">
        {{ content[5] }}
      </div>
      <div id="block_6" class="block" @click="draw(6, false)">
        {{ content[6] }}
      </div>
      <div id="block_7" class="block" @click="draw(7, false)">
        {{ content[7] }}
      </div>
      <div id="block_8" class="block" @click="draw(8, false)">
        {{ content[8] }}
      </div>
    </div>
    <h2 id="winner" v-if="winner">Winner is {{ winner }}</h2>
    <h2 v-if="istie">Tie</h2>
    <button @click="resetboard()" v-if="isover || istie">RESET</button>
    <button
      type="button"
      class="btn btn-primary"
      data-toggle="modal"
      data-target="#exampleModal"
      style="margin-top: 10px"
    >
      Gameid
    </button>
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">GameId</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input
              type="number"
              class="form-control"
              placeholder="Enter gameid"
              v-model="gameid"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              @click="close"
            >
              Close
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              data-dismiss="modal"
              @click="setgameid"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      class="btn btn-primary"
      data-toggle="modal"
      data-target="#historymodal"
      style="margin-top: 10px"
    >
      Search games by id
    </button>
    <div
      class="modal fade"
      id="historymodal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">GameId</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input
              type="text"
              class="form-control"
              placeholder="Enter gameid"
              v-model="id"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              data-dismiss="modal"
              @click="gamehistory"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
const socket = io("http://localhost:3000");
export default {
  name: "App",
  components: {},
  data() {
    return {
      content: ["", "", "", "", "", "", "", "", ""],
      turn: true,
      isover: false,
      winner: null,
      istie: false,
      gameid: null,
      alldata: [],
      id: "",
      error: null,
    };
  },
  methods: {
    draw(index, drawfromother) {
      if (this.error == null) {
        if (this.turn && this.content[index] == "" && this.winner == null) {
          this.content[index] = "X";
          this.turn = !this.turn;
        } else if (this.content[index] == "" && this.winner == null) {
          this.content[index] = "O";
          this.turn = !this.turn;
        }
        if (!drawfromother) {
          socket.emit("play", index, this.gameid);
        }
        this.calculatewinner();
        if (this.winner == null) {
          this.calculatetie();
        }
        if (this.winner != null || this.istie) {
          socket.emit(
            "data",
            this.content,
            this.winner,
            this.istie,
            this.gameid,
            this.isover
          );
        }
      }
    },
    close() {
      this.error = null;
    },
    calculatewinner() {
      const WIN_CONDITIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let i = 0; i < WIN_CONDITIONS.length; i++) {
        let firstindex = WIN_CONDITIONS[i][0];
        let secondindex = WIN_CONDITIONS[i][1];
        let thirdindex = WIN_CONDITIONS[i][2];
        if (
          this.content[firstindex] == this.content[secondindex] &&
          this.content[firstindex] == this.content[thirdindex] &&
          this.content[firstindex] != ""
        ) {
          this.isover = true;
          this.winner = this.content[firstindex];
        }
      }
    },
    resetboard() {
      for (let i = 0; i <= 8; i++) {
        this.content[i] = "";
      }
      this.isover = false;
      this.winner = null;
      this.istie = false;

      socket.emit(
        "reset",
        this.gameid,
        this.isover,
        this.winner,
        this.istie,
        new Array(9).fill("")
      );
    },
    calculatetie() {
      for (let i = 0; i <= 8; i++) {
        if (this.content[i] == "") {
          return;
        }
      }
      this.istie = true;
    },
    setgameid() {
      socket.emit("gameid", this.gameid);
    },
    gamehistory() {
      // eslint-disable-next-line no-unused-vars
      for (let [i, x] of this.alldata.entries()) {
        if (x.uniqueid == this.id) {
          this.content = x.content;
          this.winner = x.winner;
          this.istie = x.istie;
          this.isover = x.isover;
          break;
        }
      }
    },
  },
  created() {
    socket.on("play", (index) => {
      this.draw(index, true);
    });
    socket.on("reset", (gameid, isover, winner, istie, content) => {
      this.gameid = gameid;
      this.istie = istie;
      this.isover = isover;
      this.winner = winner;
      this.content = content;
    });
    socket.on("socket", (msg) => {
      this.error = msg;
    });
    socket.on("data", (content, winner, istie, uniqueid, isover) => {
      let a = {};
      a.content = content;
      a.winner = winner;
      a.istie = istie;
      a.uniqueid = uniqueid;
      a.isover = isover;
      this.alldata.push(a);
    });
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #eee;
}

h1 {
  font-size: 5rem;
  margin-bottom: 0.5em;
}

h2 {
  margin-top: 1em;
  font-size: 2rem;
  margin-bottom: 0.5em;
}

.play-area {
  display: grid;
  width: 300px;
  height: 300px;
  grid-template-columns: auto auto auto;
}

.block {
  display: flex;
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  border: 3px solid black;
  transition: background 0.2s ease-in-out;
}

.block:hover {
  cursor: pointer;
  background: #0ff30f;
}

.occupied:hover {
  background: #ff3a3a;
}

.win {
  background: #0ff30f;
}

.win:hover {
  background: #0ff30f;
}

#block_0,
#block_1,
#block_2 {
  border-top: none;
}

#block_0,
#block_3,
#block_6 {
  border-left: none;
}

#block_6,
#block_7,
#block_8 {
  border-bottom: none;
}

#block_2,
#block_5,
#block_8 {
  border-right: none;
}

button {
  outline: none;
  border: 4px solid green;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  background: none;
  transition: all 0.2s ease-in-out;
}

button:hover {
  cursor: pointer;
  background: green;
  color: white;
}

.playerWin {
  color: green;
}

.computerWin {
  color: red;
}

.draw {
  color: orangered;
}

@media only screen and (max-width: 600px) {
  h1 {
    font-size: 3rem;
    margin-bottom: 0.5em;
  }

  h2 {
    margin-top: 1em;
    font-size: 1.3rem;
  }
}
</style>
