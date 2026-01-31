import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { ParserService } from './parser.service';
import { MatchStartParser } from './parsers/match-start.parser';
import { KillParser } from './parsers/kill.parser';
import { MatchEndParser } from './parsers/match-end.parser';

@Module({
  imports: [PersistenceModule],
  providers: [ParserService, MatchStartParser, KillParser, MatchEndParser],
  exports: [ParserService],
})
export class ParserModule {}
