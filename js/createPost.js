const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const prismaCreatePost = async(title, content, authorId, img) => {
  try {
    const newPost = await prisma.blogPost.create({
      data: {title,content,authorId,img}
    })
  console.log('User created:', newPost);
  return newPost;
  }catch (error) {
    console.error('Error creating user:', error);
    throw error;}
}

module.exports = {prismaCreatePost};
