import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class ReportsService {

    constructor(private prismaService: PrismaService) {}

    all() {
        return this.prismaService.report.findMany({
            orderBy: {
                created_at: 'asc'
            }
        })
    }

    findOne(id: String) {

    }

    request() {
        return this.prismaService.report.create({
            data: {
                status: Status.PENDING
            }
        })
    }

    produce() {

    }
}
