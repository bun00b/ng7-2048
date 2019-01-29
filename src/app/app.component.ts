import { Component, HostListener } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent {
  tiles: number[] = new Array(16);

  constructor() {
    this.tiles[Math.floor(Math.random() * 16)] = 2;
  }

  @HostListener("document:keypress", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code.startsWith("Numpad")) {
      const input = Number(event.code.substr(-1));
      if (input && input % 2 === 0) {
        console.log(input);
      }
    }
  }
}
