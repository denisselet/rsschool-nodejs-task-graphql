import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';
import { MemberTypesType, PostType, ProfileType, UserType } from './types';

export const rootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.users.findMany();
        return responseDB;
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.profiles.findMany();
        return responseDB;
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberTypesType),
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.memberTypes.findMany();
        return responseDB;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.posts.findMany();
        return responseDB;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.users.findOne({
          key: 'id',
          equals: args.id,
        });
        return responseDB;
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.posts.findOne({
          key: 'id',
          equals: args.id,
        });
        return responseDB;
      },
    },
    memberType: {
      type: MemberTypesType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.memberTypes.findOne({
          key: 'id',
          equals: args.id,
        });
        return responseDB;
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.profiles.findOne({
          key: 'id',
          equals: args.id,
        });
        return responseDB;
      },
    },
  },
});
