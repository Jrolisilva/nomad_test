import { Injectable } from '@nestjs/common';

export interface KillParseResult {
  occurredAtRaw: string;
  killer: string;
  victim: string;
  weapon: string;
  isWorld: boolean;
}

@Injectable()
export class KillParser {
  private readonly pattern =
    /^(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - (.+) killed (.+) (using|by) (.+)$/;

  parse(line: string): KillParseResult | null {
    const match = this.pattern.exec(line);
    if (!match) {
      return null;
    }

    const killer = match[2];
    return {
      occurredAtRaw: match[1],
      killer,
      victim: match[3],
      weapon: match[5],
      isWorld: killer === "<WORLD>",
    };
  }
}
