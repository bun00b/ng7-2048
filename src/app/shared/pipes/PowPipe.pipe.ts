import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "power" })
export class PowerPipe implements PipeTransform {
  transform(exponent: string): number {
    const exp = parseFloat(exponent);
    return Math.pow(2, isNaN(exp) ? 1 : exp);
  }
}
