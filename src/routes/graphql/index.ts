import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { GraphQLSchema, graphql } from 'graphql';
import { rootQueryType } from './Query';
import { rootMutationType } from './Mutation';

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
      const source = `${request.body.query}`;
      const schema = new GraphQLSchema({
        query: rootQueryType,
        mutation: rootMutationType,
      });

      const response = await graphql({ schema, source, contextValue: fastify });
      reply.send(response);
    }
  );
};

export default plugin;
