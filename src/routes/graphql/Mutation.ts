import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { PostType, ProfileType, UserType } from './types';

export const rootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.users.create({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          userSubscribedTo: [],
          subscribedToUserIds: [],
        });
        return responseDB;
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        avatar: { type: GraphQLString },
        sex: { type: GraphQLString },
        birthday: { type: GraphQLInt },
        country: { type: GraphQLString },
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        userId: { type: GraphQLID },
        memberTypeId: { type: GraphQLString },
        subscribedToUserIds: { type: new GraphQLList(GraphQLID)}
      },
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.profiles.create({
          avatar: args.avatar,
          sex: args.sex,
          birthday: args.birthday,
          country: args.country,
          street: args.street,
          city: args.city,
          userId: args.userId,
          memberTypeId: args.memberTypeId,
        });
        return responseDB;
      },
    },
    createPost: {
      type: PostType,
      args: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.posts.create({
          title: args.title,
          content: args.content,
          userId: args.userId,
        });
        return responseDB;
      },
    },

    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.users.change(args.id, {
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
        });
        return responseDB;
      },
    },
    updateProfile: {
      type: ProfileType,
      args: {
        id: { type: GraphQLID },
        avatar: { type: GraphQLString },
        sex: { type: GraphQLString },
        birthday: { type: GraphQLInt },
        country: { type: GraphQLString },
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        userId: { type: GraphQLID },
        memberTypeId: { type: GraphQLString },
      },
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.profiles.change(args.id, {
          avatar: args.avatar,
          sex: args.sex,
          birthday: args.birthday,
          country: args.country,
          street: args.street,
          city: args.city,
          userId: args.userId,
          memberTypeId: args.memberTypeId,
        });
        return responseDB;
      },
    },
    updatePost: {
      type: PostType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.posts.change(args.id, {
          title: args.title,
          content: args.content,
          userId: args.userId,
        });
        return responseDB;
      },
    },
    updateMemberType: {
      type: ProfileType,
      args: {
        id: { type: GraphQLID },
        discount: { type: GraphQLInt },
        monthPostsLimit: { type: GraphQLInt },
      },
      resolve: async (parent, args, context) => {
        const responseDB = await context.db.memberTypes.change(args.id, {
          discount: args.discount,
          monthPostsLimit: args.monthPostsLimit,
        });
        return responseDB;
      },
    },
    subscribeTo: {
      type: ProfileType,
      args: {
        id: { type: GraphQLID },
        userId: { type: GraphQLID },
      },
      resolve: async (parent, args, context) => {
        const sub = await context.db.users.findOne({
          key: 'id',
          equals: args.userId,
        });

        if (sub === null) {
          throw context.httpErrors.notFound();
        }
        const subArr = sub.subscribedToUserIds.concat(args.id);

        const req = await context.db.users.change(args.userId, {
          ...sub,
          subscribedToUserIds: subArr,
        });
        await context.db.users.change(args.id, {
          userSubscribedTo: [args.userId],
        });
        
        return req;
      },
    },
    unsubscribeFrom: {
      type: ProfileType,
      args: {
        id: { type: GraphQLID },
        userId: { type: GraphQLID },
      },
      resolve: async (parent, args, context) => {
        const sub = await context.db.users.findOne({
          key: 'id',
          equals: args.userId,
        });

        if (!sub) {
          throw context.httpErrors.notFound();
        }
        if (!sub.subscribedToUserIds.includes(args.id)) {
          throw context.httpErrors.badRequest();
        }
        const subArr = sub.subscribedToUserIds.filter(
          (id: string) => id !== args.id
        );

        const req = await context.db.users.change(args.userId, {
          ...sub,
          subscribedToUserIds: subArr,
        });
        await context.db.users.change(args.id, {
          userSubscribedTo: [],
        });

        return req;
      },
    },
  },
});
