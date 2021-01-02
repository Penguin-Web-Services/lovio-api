import { Injectable, Scope, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Mutation,
  Arg,
  Authorized,
  Ctx,
} from 'type-graphql';

import { Event } from '@generated/type-graphql/models';
import { EventService } from './event.service';
import { AuthGuard } from './auth.guard';
import { MyContext } from './auth.checker';
import { CreateEventDto } from './event.dto';

@Injectable({ scope: Scope.REQUEST })
@Resolver((of) => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(() => Event)
  @UseGuards(new AuthGuard())
  @Authorized()
  createEvent(
    @Ctx() context: MyContext,
    @Arg('data') data: CreateEventDto,
  ): Promise<Event> {
    return this.eventService.createEvent(context.user.id, data);
  }

  @Mutation(() => Event)
  @UseGuards(new AuthGuard())
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
}
