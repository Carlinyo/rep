import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
declare const module: any;

async function bootstrap() {
  const cors = require('cors')
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    cors:true
  });
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  app.use(cors({ origin: "http://localhost:3000", credentials: true }))
  await app.listen(5001);
}
bootstrap();