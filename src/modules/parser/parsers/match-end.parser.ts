import { Injectable } from "@nestjs/common";

@Injectable()
export class MatchEndParser {
  private readonly pattern =
    /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} - Match \d+ has ended$/;

  tryParse(line: string): boolean {
    return this.pattern.test(line);
  }
}
