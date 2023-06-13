import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ReportsService {

    constructor(
        private prismaService: PrismaService,
        @InjectQueue('reports')
        private reportsQueue: Queue
    ) {}

    all() {
        return this.prismaService.report.findMany({
            orderBy: {
                created_at: 'asc'
            }
        })
    }

    findOne(id: number) {
        return this.prismaService.report.findUnique({
            where: {
                id
            }
        })

    }

    async request() {
        const report = await this.prismaService.report.create({
            data: {
                status: Status.PENDING
            }
        })

        await this.reportsQueue.add({ reportId: report.id })
        return report
    }

    async produce(reportId: number) {
        const randomStatus = Math.random() > 0.5 ? Status.DONE : Status.ERROR
        const randomFileName = randomStatus === Status.DONE ? `report-${reportId}` : null

        // simulacao de tempo de processamento
        await sleep(Math.random() * 10000)
        await this.prismaService.report.update({
            where: {
                id: reportId
            },
            data: {
                status: Status.PROCESSING
            }
        })

        await sleep(Math.random() * 10000)
        await this.prismaService.report.update({
            where: {
                id: reportId
            },
            data: {
                filename: randomFileName,
                status: randomStatus
            }
        })
    }
}


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))