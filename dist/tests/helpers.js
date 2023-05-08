"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanDb = void 0;
const database_1 = require("../src/config/database");
//import { createSession } from './factories/sessions-factory';
async function cleanDb() {
    await database_1.prisma.session.deleteMany({});
    await database_1.prisma.user.deleteMany({});
}
exports.cleanDb = cleanDb;
;
/*export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, "top_secret");

  await createSession(token);

  return token;
}*/ 
