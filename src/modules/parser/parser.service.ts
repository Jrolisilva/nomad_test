import { Injectable } from '@nestjs/common';
import { MatchStartParser } from './parsers/match-start.parser';
import { KillParser } from './parsers/kill.parser';
import { MatchEndParser } from './parsers/match-end.parser';

@Injectable()
export class ParserService {
  constructor(
    private readonly matchStartParser: MatchStartParser,
    private readonly killParser: KillParser,
    private readonly matchEndParser: MatchEndParser,
  ) {}

  parse(content: string): { totalLines: number } {
    const lines = content
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0);

    for (const line of lines) {
      this.matchStartParser.tryParse(line);
      this.killParser.tryParse(line);
      this.matchEndParser.tryParse(line);
    }

    return { totalLines: lines.length };
  }
}
