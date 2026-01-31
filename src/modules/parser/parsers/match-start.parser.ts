import { Injectable } from "@nestjs/common";

@Injectable()
export class MatchStartParser {
  private readonly pattern =
    /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} - New match \d+ has started$/;

  tryParse(line: string): boolean {
    return this.pattern.test(line);
  }
}
