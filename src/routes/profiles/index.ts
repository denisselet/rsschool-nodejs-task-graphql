import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    const profiles = await fastify.db.profiles.findMany();

    return profiles;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (profile === null) {
        throw fastify.httpErrors.notFound();
      }

      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      if (Object.keys(request.body).length < 7) {
        throw fastify.httpErrors.badRequest();
      }
      try {
        const profile = await fastify.db.profiles.create({
          avatar: request.body.avatar,
          sex: request.body.sex,
          birthday: request.body.birthday,
          country: request.body.country,
          street: request.body.street,
          city: request.body.city,
          memberTypeId: request.body.memberTypeId,
          userId: request.body.userId,
        });

        return profile;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const isId = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (isId === null) {
        throw fastify.httpErrors.badRequest('User not found');
      }

      const req = await fastify.db.profiles.delete(request.params.id);

      return req;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (profile === null) {
        throw fastify.httpErrors.badRequest();
      }
      if (Object.keys(request.body)) {
        throw fastify.httpErrors.badRequest();
      }
      const {id, ...arg} = profile;
      const rew = {...arg, ...request.body}
      const req = await fastify.db.profiles.change(request.params.id, rew);
      return req;
    }
  );
};

export default plugin;
