import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type:  new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type:  new GraphQLNonNull(GraphQLString) },
    userSubscribedTo: { type: new GraphQLList(GraphQLID) },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
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

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type:  new GraphQLNonNull(GraphQLID) },
    avatar: { type:  new GraphQLNonNull(GraphQLString) },
    sex: { type:  new GraphQLNonNull(GraphQLString) },
    birthday: { type:  new GraphQLNonNull(GraphQLString) },
    country: { type:  new GraphQLNonNull(GraphQLString) },
    street: { type:  new GraphQLNonNull(GraphQLString) },
    city: { type:  new GraphQLNonNull(GraphQLString) },
    userId: { type:  new GraphQLNonNull(GraphQLID) },
    memberTypeId: { type:  new GraphQLNonNull(GraphQLString) },
  }),
});
export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type:  new GraphQLNonNull(GraphQLID) },
    title: { type:  new GraphQLNonNull(GraphQLString) },
    content: { type:  new GraphQLNonNull(GraphQLString) },
    userId: { type:  new GraphQLNonNull(GraphQLID) },
  }),
});

export const MemberTypesType = new GraphQLObjectType({
  name: 'MemberTypes',
  fields: () => ({
    id: { type:  new GraphQLNonNull(GraphQLID) },
    discount: { type:  new GraphQLNonNull(GraphQLString) },
    monthPostsLimit: { type:  new GraphQLNonNull(GraphQLString) },
  }),
});