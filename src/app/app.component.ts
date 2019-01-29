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
        this.move(input);
      }
    }
  }

  move(input: number) {
    let skipNext = false;
    let whileLoop = true;
    const rows: number[][] = [];
    const newRows: number[][] = [];
    const possibleNewNumbers = [...Array.from(new Set(this.tiles))].filter(function (el) {
      return el !== null && el !== undefined;
    });

    while (this.tiles.length > 0) {
      rows.push(this.tiles.splice(0, 4));
    }
    switch (input) {
      case 2:
        break;
      case 4:
        // code for moving everything to the left while adding
        rows.forEach(row => {
          row = row.filter(function (el) {
            return el != null;
          });
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
          newRows.push(newRow);
        });
        // code for generating new tile on the right
        const rightCol: number[] = [];
        _.each(newRows, row => {
          rightCol.push(row[3]);
        });
        if (_.indexOf(rightCol, null) > -1) {
          while (whileLoop) {
            const randRow: number = Math.floor(Math.random() * 4);
            if (newRows[randRow][3] === null) {
              newRows[randRow][3] = _.sample(possibleNewNumbers);
              whileLoop = false;
            }
          }
        } else {
          this.gameOver = true;
        }

        this.tiles = [].concat(...newRows);
        break;
      case 6:
        // code to move everything to the right while adding
        rows.forEach(row => {
          row = row.filter(function (el) {
            return el !== null;
          }).reverse();
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
          newRows.push(newRow.reverse());
        });

        this.tiles = [].concat(...newRows);
        break;
      case 8:
        break;
    }
    if (this.gameOver) {
      if (confirm("Game over, restart?")) {
        this.startGame();
      }
    }
  }
}
