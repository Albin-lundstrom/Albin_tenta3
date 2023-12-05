const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const prismaDeletePost = async(ids) => {

console.log(ids)

try {
  const removeUser = await prisma.BlogPost.delete({
    where: { id: ids },
})
  console.log('Post deleted:', removeUser);
  return removeUser;
} catch (error) {
  console.error('Error creating user:', error);
  throw error;
}
}

module.exports = {prismaDeletePost};

