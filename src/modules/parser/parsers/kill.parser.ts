import { Injectable } from "@nestjs/common";

@Injectable()
export class KillParser {
  private readonly pattern =
    /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} - (.+) killed (.+) (using|by) (.+)$/;

  tryParse(line: string): boolean {
    return this.pattern.test(line);
  }
}
