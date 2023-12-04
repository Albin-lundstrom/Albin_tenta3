const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getspesUsers = async(user) => {
    try {
    const printUsers = await prisma.user.findMany({
        where: {username: user}
    });
    return printUsers
}catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

module.exports = {getspesUsers};

