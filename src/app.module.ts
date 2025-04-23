import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { CvModule } from './cv/cv.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './common/auth.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('DB_PASSWORD:', config.get('DB_PASSWORD'), typeof config.get('DB_PASSWORD'));
        console.log('DB_HOST:', config.get('DB_HOST'), typeof config.get('DB_PASSWORD'));
        return {
          type: 'mssql',
          host: config.get('DB_HOST'),
          port: +config.get<number>('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
          options: {
            encrypt: false, // <--- IMPORTANT!
            trustServerCertificate: true, // <--- TRUST SELF-SIGNED CERTIFICATES
          },
        };
      },
    }),
    
    CvModule, SkillModule, UserModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'v2/cv', method: RequestMethod.ALL },
        { path: 'v2/cv/:id', method: RequestMethod.ALL }
      );
  }
}
