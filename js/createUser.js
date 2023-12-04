const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const prismaCreateUser = async(username, password, admin) => {
  try {
    const newUser = await prisma.user.create({
      data: {username,password,admin}
    })
  console.log('User created:', newUser);
  return newUser;
  }catch (error) {
    console.error('Error creating user:', error);
    throw error;}
}


main()
.then(async () => {
  await prisma.$disconnect()
})

.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})

module.exports = {prismaCreateUser};
