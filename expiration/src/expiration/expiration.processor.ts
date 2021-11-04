import { ExpirationCompleteEvent, Subjects } from '@ar-ticketing/common';
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { JobPayload } from '../types';

@Processor('expiration')
export class ExpirationConsumer {
  private readonly logger = new Logger(ExpirationConsumer.name);
  constructor(private readonly publisher: Publisher) {}

  @Process()
  handleExpiration(job: Job<JobPayload>) {
    this.logger.log(`Order "${job.data.orderId}" Expired`);
    this.publisher.emit<Subjects, ExpirationCompleteEvent>(
      Subjects.ExpirationComplete,
      { orderId: job.data.orderId },
    );
  }
}
