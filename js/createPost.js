const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const prismaCreatePost = async(title, content, authorId) => {
  try {
    const newPost = await prisma.user.create({
      data: {title,content,authorId}
    })
  console.log('User created:', newPost);
  return newPost;
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

module.exports = {prismaCreatePost};
