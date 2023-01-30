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
    reply.send('Hello World');
    return reply.send({ hello: 'world' });
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

      if (!req) {
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
        equals: request.params.id,
      });

      if (!sub) {
        throw fastify.httpErrors.notFound();
      }

      const req = await fastify.db.users.change(request.params.id, {
        ...request.body,
        subscribedToUserIds: [...sub.subscribedToUserIds, request.body.userId],
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
        equals: request.params.id,
      });

      if (!sub) {
        throw fastify.httpErrors.notFound();
      }
      if(!sub.subscribedToUserIds.includes(request.body.userId)) {
        throw fastify.httpErrors.badRequest();
      }

      const req = await fastify.db.users.change(request.params.id, {
        ...request.body,
        subscribedToUserIds: [...sub.subscribedToUserIds.filter((id) => id !== request.body.userId)],
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
      if (Object.keys(request.body)) {
        throw fastify.httpErrors.badRequest();
      }
      const req = await fastify.db.users.change(
        request.params.id,
        request.body
      );

      return req;
    }
  );
};

export default plugin;
