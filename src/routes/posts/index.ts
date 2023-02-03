import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    const req = fastify.db.posts.findMany();

    return req;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const req = await fastify.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (req === null) {
        throw fastify.httpErrors.notFound('Post not found');
      } else {
        return req;
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const req = await fastify.db.posts.create({
        content: request.body.content,
        title: request.body.title,
        userId: request.body.userId,
      });

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
    async function (request, reply): Promise<PostEntity> {
      try {
        const checkPost = await fastify.db.posts.findOne({
          key: 'id',
          equals: request.params.id,
        });
        if (checkPost === null) {
          throw fastify.httpErrors.notFound('Post not found');
        }
        const req = await fastify.db.posts.delete(request.params.id);
        return req;

      } catch (error) {
        throw fastify.httpErrors.badRequest();
      }
      
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      if (!request.body.content && !request.body.title) {
        throw fastify.httpErrors.badRequest();
      }
      const req = await fastify.db.posts.change(
        request.params.id,
        {
          content: request.body.content,
          title: request.body.title,
        }
      );

      return req;
    }
  );
};

export default plugin;
