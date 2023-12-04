const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getPosts = async() => {
    try {
    const printPosts = await prisma.BlogPost.findMany();
    return printPosts
}catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

module.exports = {getPosts};
