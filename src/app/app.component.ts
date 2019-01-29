import { Component, HostListener } from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent {
  tiles: number[] = new Array(16);
  gameOver = false;

  constructor() {
    this.startGame();
  }

  startGame() {
    this.tiles = new Array(16);
    this.tiles[Math.floor(Math.random() * 16)] = 2;
    this.gameOver = false;
  }

  @HostListener("document:keypress", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.gameOver && event.code.startsWith("Numpad")) {
      const input = Number(event.code.substr(-1));
      if (input && input % 2 === 0) {
        // only possible inputs are 2 4 6 8
        this.move(input);
      }
    }
  }

  move(input: number) {
    let skipNext = false;
    let whileLoop = true;
    const possibleNewNumbers = [...Array.from(new Set(this.tiles))].filter(function (el) {
      return el !== null && el !== undefined;
    });

    if (input === 4 || input === 6) {
      // handle horizontal move
      const rows: number[][] = [];
      const newRows: number[][] = [];
      while (this.tiles.length > 0) {
        rows.push(this.tiles.splice(0, 4));
      }
      // code for moving everything to the left/right(reverse) while adding
      rows.forEach(row => {
        row = row.filter(function (el) {
          return el != null;
        });
        if (input === 6) {
          row = row.reverse();
        }
        const newRow: number[] = [];
        for (let index = 0; index < row.length; index++) {
          if (!skipNext) {
            if (index !== (row.length - 1) && row[index] === row[index + 1]) {
              newRow.push(row[index] + row[index + 1]);
              skipNext = true;
            } else {
              newRow.push(row[index]);
            }
          } else {
            skipNext = false;
          }
        }
        while (newRow.length < 4) {
          newRow.push(null);
        }
        input === 4 ? newRows.push(newRow) : newRows.push(newRow.reverse());
      });
      // code for generating new tile on the right
      const sideCol: number[] = [];
      // if move left: col is right so index 3, else col is left so index 0
      const indexToUse: number = input === 4 ? 3 : 0;
      _.each(newRows, row => {
        sideCol.push(row[indexToUse]);
      });
      if (_.indexOf(sideCol, null) > -1) {
        while (whileLoop) {
          const randRow: number = Math.floor(Math.random() * 4);
          if (newRows[randRow][indexToUse] === null) {
            newRows[randRow][indexToUse] = _.sample(possibleNewNumbers);
            whileLoop = false;
          }
        }
      } else {
        this.gameOver = true;
      }

      this.tiles = [].concat(...newRows);
    } else {
      // handle vertical move
    }
    if (this.gameOver) {
      if (confirm("Game over, restart?")) {
        this.startGame();
      }
    }
  }
}
