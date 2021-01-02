import { Field, InputType } from 'type-graphql';
import { Event } from '@generated/type-graphql/models';
import { EventType } from '@prisma/client';

@InputType()
export class CreateEventDto implements Partial<Event> {
  @Field()
  name: string;
  @Field()
  type: EventType;
  @Field()
  active: boolean;
  @Field({ nullable: true })
  startAt: Date;
  @Field({ nullable: true })
  endAt: Date;
}
