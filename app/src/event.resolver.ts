import { Injectable, Scope, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Arg, Authorized, Ctx, Query } from 'type-graphql';

import { Event, Asset } from '@generated/type-graphql/models';
import { EventService } from './event.service';
import { MyContext } from './auth.checker';

import { AddEventAssetDto, CreateEventDto } from './event.dto';

@Injectable({ scope: Scope.REQUEST })
@Resolver((of) => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(() => Event)
  @Authorized()
  createEvent(
    @Ctx() context: MyContext,
    @Arg('data') data: CreateEventDto,
  ): Promise<Event> {
    return this.eventService.createEvent(context.user.id, data);
  }

  @Mutation(() => Event)
  @Authorized()
  async joinEvent(
    @Ctx() context: MyContext,
    @Arg('eventId') eventId: number,
  ): Promise<boolean> {
    const res = await this.eventService.addEventUser({
      eventId,
      userId: context.user.id,
    });

    return !!res;
  }

  @Query(() => [Event])
  @Authorized()
  eventsByCurrentUser(@Ctx() context: MyContext) {
    return this.eventService.eventsByUserId({ userId: context.user.id });
  }

  @Mutation(() => Asset)
  @Authorized()
  async eventAddAsset(
    @Ctx() { user }: MyContext,
    @Arg('data') data: AddEventAssetDto,
  ) {
    return this.eventService.addAsset(user.id, data);
  }
}
