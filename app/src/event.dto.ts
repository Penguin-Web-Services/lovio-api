import { Field, InputType } from 'type-graphql';
import { Event, Asset } from '@generated/type-graphql/models';
import { EventType, AssetType } from '@prisma/client';

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

@InputType()
export class AddEventAssetDto implements Partial<Asset> {
  @Field()
  eventId: number;
  @Field()
  type: AssetType;
  @Field()
  url: string;
}
