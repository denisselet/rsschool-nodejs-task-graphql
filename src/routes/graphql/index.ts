import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { GraphQLSchema, graphql } from 'graphql';
import { test } from './Query';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async (request, reply) => {
      const { id } = await fastify.db.users.create({
        firstName: 'test',
        lastName: 'test',
        email: 'test',
      });

      await fastify.db.profiles.create({
        userId: id,
        avatar: 'test',
        sex: 'test',
        birthday: 2011,
        country: 'test',
        street: 'test',
        city: 'test',
        memberTypeId: 'test',
      });
      await fastify.db.posts.create({
        userId: id,
        title: 'test',
        content: 'test',
      });
      
      const ret = await test();
      const source = `${request.body.query}`;
      const schema = new GraphQLSchema({
        query: ret.rootQueryType(fastify),
      });

      const response = await graphql({ schema, source, contextValue: fastify });
      reply.send(response);
    }
  );
};

export default plugin;
