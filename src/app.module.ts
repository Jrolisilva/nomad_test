import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './modules/upload/upload.module';
import { ParserModule } from './modules/parser/parser.module';
import { MatchesModule } from './modules/matches/matches.module';
import { PlayersModule } from './modules/players/players.module';
import { StatsModule } from './modules/stats/stats.module';
import { PersistenceModule } from './modules/persistence/persistence.module';

@Module({
  imports: [
    UploadModule,
    ParserModule,
    MatchesModule,
    PlayersModule,
    StatsModule,
    PersistenceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
