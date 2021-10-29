const { ApolloServer, gql } = require("apollo-server");

const port = process.env.PORT || 2000

const blogs = [
    {
        title: "Harry Potter and the Chamber of Secrets",
        author:"J.K Rowling",
        likes: 1,
        unlikes: 2,
        comments: [],
        
    },

    {
        title: "Jurassic Park",
        author:"Michael Crichton",
        ISBN:"0-54"
    }
];

const schemas = gql`
type Blog {
    title: String!
    author: String!
}


type Query {
    blogs: [Blog]
    blog(title: String!): Blog
}
type Mutation {
createBlog(title:String!, author: String!):Blog
}
`;


const booksResolvers = {
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
        }
    },
};

const server = new ApolloServer({ typeDefs: schemas, resolvers: booksResolvers});

server.listen( port ).then(({url}) => {
    console.log(`Server ready at ${url}`);
}).catch(err => console.log(err));
