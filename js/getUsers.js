const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getUsers = async() => {
    try {
    const printUsers = await prisma.user.findMany();
    return printUsers
}catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

module.exports = {getUsers};

