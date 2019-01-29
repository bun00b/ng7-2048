import { Component, HostListener } from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent {
  cols = 4;
  columns = 4;
  tiles: number[] = [];
  gameOver = false;

  startGame() {
    this.columns = this.cols;
    this.tiles = new Array(Math.pow(this.cols, 2));
    this.tiles[Math.floor(Math.random() * Math.pow(this.cols, 2))] = 2;
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
    const isVertical = input === 2 || input === 8;
    let skipNext = false;
    let whileLoop = true;
    // possible new appearing numbers are any numbers currently on screen
    const possibleNewNumbers = [...Array.from(new Set(this.tiles))].filter(function (el) {
      return el !== null && el !== undefined;
    });

    // init rows and cols
    let rows: number[][] = [];
    let newRows: number[][] = [];
    while (this.tiles.length > 0) {
      rows.push(this.tiles.splice(0, this.cols));
    }
    if (isVertical) {
      // transpose matrix and use same logic as horizontal move
      rows = _.zip.apply(_, [...rows]);
    }
    // code for moving everything to the left/right(reverse) while adding
    rows.forEach(row => {
      row = row.filter(function (el) {
        return el != null;
      });
      if (input === 6 || input === 2) {
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
      while (newRow.length < this.cols) {
        newRow.push(null);
      }
      input === 4 || input === 8 ? newRows.push(newRow) : newRows.push(newRow.reverse());
    });
    // code for generating new tile on the right
    const sideCol: number[] = [];
    // if move left: col is right so index 3, else col is left so index 0
    const indexToUse: number = input === 4 || input === 8 ? this.cols - 1 : 0;
    _.each(newRows, row => {
      sideCol.push(row[indexToUse]);
    });
    if (_.indexOf(sideCol, null) > -1) {
      while (whileLoop) {
        const randRow: number = Math.floor(Math.random() * this.cols);
        if (newRows[randRow][indexToUse] === null) {
          newRows[randRow][indexToUse] = _.sample(possibleNewNumbers);
          whileLoop = false;
        }
      }
    } else {
      this.gameOver = true;
    }

    if (isVertical) {
      // transpose matrix again
      newRows = _.zip.apply(_, [...newRows]);
    }

    this.tiles = [].concat(...newRows);

    if (this.gameOver) {
      if (confirm("Game over, restart?")) {
        this.startGame();
      }
    }
    if (_.find(this.tiles, t => t === 2048)) {
      if (confirm("You won! Play again?")) {
        this.startGame();
      }
    }
  }
}
