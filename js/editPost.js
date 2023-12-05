const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const prismaEditPost = async(ids, changes) => {
console.log(ids);
console.log(changes);
try {
  const updateUser = await prisma.BlogPost.update({
    where: { id: ids },
    data: changes
})
  console.log('Post Edited:', updateUser);
  return updateUser;
} catch (error) {
  console.error('Error creating user:', error);
  throw error;
}
}

module.exports = {prismaEditPost};

