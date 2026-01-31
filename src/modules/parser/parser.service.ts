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
}
