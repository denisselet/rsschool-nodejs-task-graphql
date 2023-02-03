import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    profiles: {
      type: ProfileType,
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.profiles.findOne({
          key: 'userId',
          equals: parent.id,
        });        
        return responseDB;
      },
    },
    posts: {
      type: PostType,
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.posts.findOne({
          key: 'userId',
          equals: parent.id,
        });        
        return responseDB;
      },
    },
    memberTypes: {
      type: MemberTypesType,
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.memberTypes.findOne({
          key: 'userId',
          equals: parent.id,
        });        
        return responseDB;
      },
    },
  }),
});

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLString },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    userId: { type: GraphQLID },
    memberTypeId: { type: GraphQLString },
  }),
});
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});

const MemberTypesType = new GraphQLObjectType({
  name: 'MemberTypes',
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLString },
    monthPostsLimit: { type: GraphQLString },
  }),
});

export const test = async () => {
  return {
    rootQueryType: (fastify: {
      db: {
        users: {
          findMany: () => any;
          findOne: (arg0: { key: string; equals: any }) => any;
        };
        profiles: {
          findMany: () => any;
          findOne: (arg0: { key: string; equals: any }) => any;
        };
        memberTypes: {
          findMany: () => any;
          findOne: (arg0: { key: string; equals: any }) => any;
        };
        posts: {
          findMany: () => any;
          findOne: (arg0: { key: string; equals: any }) => any;
        };
      };
    }) =>
      new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          test: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve: async (parent, args) => {
              return args;
            },
          },
          users: {
            type: new GraphQLList(UserType),
            resolve: async (parent, args) => {
              // console.log(UserType.getFields());
              
              
              const responseDB = await fastify.db.users.findMany();
              return responseDB;
            },
          },
          profiles: {
            type: new GraphQLList(ProfileType),
            resolve: async (parent, args) => {
              const responseDB = await fastify.db.profiles.findMany();
              return responseDB;
            },
          },
          memberTypes: {
            type: new GraphQLList(MemberTypesType),
            resolve: async (parent, args) => {
              const responseDB = await fastify.db.memberTypes.findMany();
              return responseDB;
            },
          },
          posts: {
            type: new GraphQLList(PostType),
            resolve: async (parent, args) => {
              const responseDB = await fastify.db.posts.findMany();
              return responseDB;
            },
          },
          user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve: async (parent, args) => {
              const responseDB = await fastify.db.users.findOne({
                key: 'id',
                equals: args.id,
              });
              return responseDB;
            },
          },
          post: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve: async (parent, args) => {
              const responseDB = await fastify.db.posts.findOne({
                key: 'id',
                equals: args.id,
              });
              return responseDB;
            },
          },
          memberType: {
            type: MemberTypesType,
            args: { id: { type: GraphQLID } },
            resolve: async (parent, args) => {
              const responseDB = await fastify.db.memberTypes.findOne({
                key: 'id',
                equals: args.id,
              });
              return responseDB;
            },
          },
          profile: {
            type: ProfileType,
            args: { id: { type: GraphQLID } },
            resolve: async (parent, args) => {
              const responseDB = await fastify.db.profiles.findOne({
                key: 'id',
                equals: args.id,
              });
              return responseDB;
            },
          },
        },
      }),
  };
};
