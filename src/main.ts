import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API - Paginação')
    .setDescription('Raro308')
    .setTermsOfService('http://swagger.io/terms/')
    .setLicense(
      'Apache 2.0',
      'https://www.apache.org/licenses/LICENSE-2.0.html',
    )
    .setVersion('1.0')
    .addServer('http://localhost:8000')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1', app, document);

  await app.listen(8000);
}
bootstrap();
