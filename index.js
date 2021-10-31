const { ApolloServer, gql } = require("apollo-server");

const port = process.env.PORT || 2000

const blogs = [
    {
        title: "Harry Potter and the Chamber of Secrets",
        author:"J.K Rowling",
        likes: 1,
        unlikes: 2,
        comments: [{comment:"This is my comment", reply: [ "This is my comment", "great piece" ] ,}],
        banner: "Image source",
        blogMessage: "Hello world"

    },

    {
        title: "Jurassic Park",
        author:"Michael Crichton",
        likes: 1,
        unlikes: 2,
        comments: [{comment:"This is my comment", reply: [ "This is my comment", "great piece" ] ,}],
        banner: "Image source",
        blogMessage: "Hello world"
    }
];

const schemas = gql`
type Blog {
    title: String!,
    author: String!,
    likes: Int,
    unlikes: Int,
    comments: [Comment],
    banner: String
}

type Comment{
    comment: String!,
    reply: [String]

}

type Query {
    blogs: [Blog]
    blog(title: String!): Blog
}

type Mutation {
    createBlog(title:String!, author: String!, blogMessage: String!):Blog,
    commentOnBlog(title: String!, comments: String!): Blog,
    deleteBlog(title: String!): Blog,
    likeBlog(title: String!): Blog,
    unLikeBlog(title: String!): Blog,
    updateBlog(
            title: String!,
            newTitle: String,
            author: String,
            blogMessage: String,
            banner: String
        ): Blog,
    deleteCommentOnBlog(title: String!, comment: String!): Blog
}
`;

const blogsResolvers = {
    Query: {
        blogs: () => blogs, 
        blog:(parent,args) => blogs.find(blog => blog.title === args.title)
    },
    Mutation: {
        createBlog: (parent, args) => {
            const { title, author } = args;
            const blog = { title, author};
            blogs.push(blog);
            return blog;
        },
        likeBlog: (parent, args) => {
            const blog = blogs.find(blog => blog.title === args.title)
            blog.likes+=1
            return blog
        },
        unLikeBlog: (parent, args) => {
            const blog = blogs.find(blog => blog.title === args.title)
            blog.likes+=1
            return blog
        },
        commentOnBlog: (parent, args) => {
            const blog = blogs.find(blog => blog.title === args.title)
            if (blog && args.comments ){
                blog.comments.push({comment: args.comments })
                return blog
            }else{
                throw new Error("Blog not found")
           }  
        },
        deleteBlog: (parent, args) => {
            const blog = blogs.find(blog => blog.title === args.title)
            if (blog) {
                const index = blogs.indexOf(blog)
                blogs.splice(index, 1)
                return blog
            }else{
                throw new Error("Blog not found")
           }   
        },
        updateBlog: (parent, args) => {
            const blog = blogs.find(blog => blog.title === args.title) 
            if (blog){
                blog.title = args.newTitle ? args.newTitle : args.title
                blog.author = args.author
                blog.blogMessage = args.blogMessage
                blog.banner = args.banner
                return blog
            }else{
                 throw new Error("Blog not found")
            }    
        },

    },
};

const server = new ApolloServer({
     typeDefs: schemas, 
     resolvers: blogsResolvers,
     playground: true,
     introspection: true
    });

server.listen( port ).then(( {url }) => {
    console.log(`Server ready at ${url}`);
}).catch(err => console.log( err ));
