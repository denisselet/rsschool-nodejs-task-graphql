import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    const req = await fastify.db.users.findMany();

    return req;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const req = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (req === null) {
        throw fastify.httpErrors.notFound();
      }

      return req;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const req = await fastify.db.users.create(request.body);

      return req;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const checkUser = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      const users = fastify.db.users.findMany();
      (await users).map((user) => {
        if (user.subscribedToUserIds.includes(request.params.id)) {
          const subArr = user.subscribedToUserIds.filter(
            (id) => id !== request.params.id
          );
          fastify.db.users.change(user.id, {
            ...user,
            subscribedToUserIds: subArr,
          });
        }
      });
      const posts = fastify.db.posts.findMany();
      (await posts).map((post) => {
        if (post.userId === request.params.id) {
          fastify.db.posts.delete(post.id);
        }
      });
      const profiles = fastify.db.profiles.findMany();
      (await profiles).map((profile) => {
        if (profile.userId === request.params.id) {
          fastify.db.profiles.delete(profile.id);
        }
      });

      if (checkUser === null) {
        throw fastify.httpErrors.badRequest();
      }
      const req = await fastify.db.users.delete(request.params.id);

      return req;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const sub = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (sub === null) {
        throw fastify.httpErrors.notFound();
      }
      const subArr = sub.subscribedToUserIds.concat(request.params.id);

      const req = await fastify.db.users.change(request.body.userId, {
        ...sub,
        subscribedToUserIds: subArr,
      });

      return req;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const sub = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (!sub) {
        throw fastify.httpErrors.notFound();
      }
      if (!sub.subscribedToUserIds.includes(request.params.id)) {
        throw fastify.httpErrors.badRequest();
      }
      const subArr = sub.subscribedToUserIds.filter(
        (id) => id !== request.params.id
      );

      const req = await fastify.db.users.change(request.body.userId, {
        ...sub,
        subscribedToUserIds: subArr,
      });

      return req;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (user === null) {
        throw fastify.httpErrors.badRequest();
      }

      const { id, ...arg } = user;
      const req = await fastify.db.users.change(request.params.id, {
        ...arg,
        ...request.body,
      });

      return req;
    }
  );
};

export default plugin;
