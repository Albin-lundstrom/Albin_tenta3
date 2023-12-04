const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const prismaCreatePost = async(title, content, authorId, img, clickbait) => {
  try {
    console.log(clickbait);
    console.log(img);
    const newPost = await prisma.blogPost.create({
      data: {title,content,authorId,img,clickbait}
    })
  console.log('User created:', newPost);
  return newPost;
  }catch (error) {
    console.error('Error creating user:', error);
    throw error;}
}

module.exports = {prismaCreatePost};
