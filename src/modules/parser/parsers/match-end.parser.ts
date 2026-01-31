import { Injectable } from '@nestjs/common';

export interface MatchEndParseResult {
  externalId: string;
  endedAtRaw: string;
}

@Injectable()
export class MatchEndParser {
  private readonly pattern =
    /^(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - Match (\d+) has ended$/;

  parse(line: string): MatchEndParseResult | null {
    const match = this.pattern.exec(line);
    if (!match) {
      return null;
    }

    return { endedAtRaw: match[1], externalId: match[2] };
  }
}
