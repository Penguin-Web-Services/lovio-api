import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./**/*.graphql'],
  path: join(process.cwd(), './graphql.schema.ts'),
  outputAs: 'class',
  emitTypenameField: true,
  skipResolverArgs: false,
  watch: true,
});
