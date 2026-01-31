import { Injectable } from '@nestjs/common';

export interface MatchStartParseResult {
  externalId: string;
  startedAtRaw: string;
}

@Injectable()
export class MatchStartParser {
  private readonly pattern =
    /^(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - New match (\d+) has started$/;

  parse(line: string): MatchStartParseResult | null {
    const match = this.pattern.exec(line);
    if (!match) {
      return null;
    }

    return { startedAtRaw: match[1], externalId: match[2] };
  }
}
