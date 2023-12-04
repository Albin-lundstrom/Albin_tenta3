const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const prismaEditUser = async(ids, changes) => {
console.log(ids);
console.log(changes);
try {
  const updateUser = await prisma.user.update({
    where: { username: ids },
    data: changes
})
  console.log('User Edited:', updateUser);
  return updateUser;
} catch (error) {
  console.error('Error creating user:', error);
  throw error;
}
}

module.exports = {prismaEditUser};

