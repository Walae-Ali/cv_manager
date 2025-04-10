import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Cv } from './cv/entities/cv.entity';
import { User } from './user/entities/user.entity';
import { Skill } from './skill/entities/skill.entity';
import {
  randEmail,
  randUserName,
  randPassword,
  randFirstName,
  randLastName,
  randJobTitle,
  randNumber,
  randUrl,
  randAlphaNumeric,
  rand,
} from '@ngneat/falso';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  // Vider les données dans le bon ordre
  await dataSource.getRepository(Cv).delete({});
  await dataSource.getRepository(User).delete({});
  await dataSource.getRepository(Skill).delete({});

  //  Création des skills
  const skillRepo = dataSource.getRepository(Skill);
  const skillNames = ['NestJS', 'TypeScript', 'React', 'NodeJS', 'Python', 'Docker'];
  const skills = skillNames.map(name => skillRepo.create({ designation: name }));
  await skillRepo.save(skills);

  //  Création des users et cvs
  const userRepo = dataSource.getRepository(User);
  const cvRepo = dataSource.getRepository(Cv);

  for (let i = 0; i < 5; i++) {
    const user = userRepo.create({
        username: randUserName(),
        email: randEmail(),
        password: randPassword[0],
    });

    await userRepo.save(user);

    for (let j = 0; j < 2; j++) {
      const cv = cvRepo.create({
        name: randLastName(),
        firstname: randFirstName(),
        age: randNumber({ min: 20, max: 40 }),
        cin: randAlphaNumeric({ length: 8 }).join(""),
        job: randJobTitle(),
        path: randUrl(),
        user: user,
        skills: rand(skills,{length: Math.floor(Math.random() * 3) + 1, })
      })
      await cvRepo.save(cv);
    }
  }

  console.log('✅ Base de données seedée avec succès !');
  await app.close();
}
bootstrap();
