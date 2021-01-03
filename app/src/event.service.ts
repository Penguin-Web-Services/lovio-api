import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AddEventAssetDto, CreateEventDto } from './event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent(
    createdById: number,
    { name, type, active = true, startAt, endAt }: CreateEventDto,
  ) {
    const event = await this.prisma.event.create({
      data: {
        name,
        type,
        active,
        startAt,
        endAt,
        createdBy: {
          connect: {
            id: createdById,
          },
        },
      },
    });

    await this.addEventUser({ userId: createdById, eventId: event.id });

    return event;
  }

  addEventUser({ userId, eventId }: { userId: number; eventId: number }) {
    return this.prisma.eventOnUser.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        event: {
          connect: {
            id: eventId,
          },
        },
        active: true,
      },
    });
  }

  async eventsByUserId({ userId }: { userId: number }) {
    const events = await this.prisma.event.findMany({
      where: {
        createdBy: {
          id: userId,
        },
      },
    });

    return events;
  }

  async addAsset(userId, { eventId, type, url }: AddEventAssetDto) {
    const asset = await this.prisma.asset.create({
      data: {
        type,
        url,
        user: {
          connect: {
            id: userId,
          },
        },
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    });

    return asset;
  }
  async eventById(eventId: number) {
    return this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
  }

  async eventAssetsByEventId(eventId: number) {
    return this.prisma.asset.findMany({
      where: {
        eventId,
      },
    });
  }
}
