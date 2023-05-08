import { prisma } from "../../config/database";

async function findByEmail(email: string) {
    const findEmail = await prisma.user.findFirst({
        where: { email }
    });

    return findEmail;
};

async function create(email: string, password: string) {
    await prisma.user.create({
        data:{
            email: email,
            password: password
        }
    })
};

const userRepository = {
  findByEmail,
  create
};

export default userRepository;