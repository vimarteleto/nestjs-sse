import { Controller, Get, MessageEvent, Param, ParseIntPipe, Post, Render, Res, Sse } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Observable, defer, map, repeat, tap } from 'rxjs';
import { Status } from '@prisma/client';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {

    constructor(private reportService: ReportsService) {}

    @Get()
    all() {
        return this.reportService.all()
    }

    @Get(':id')
    findOne(@Param('id', new ParseIntPipe()) id: number) {
        return this.reportService.findOne(id)
    }

    @Post()
    request() {
        return this.reportService.request()
    }

    @Get('view')
    @Render('reports')
    async view() {
        const reports = await this.reportService.all()
        return { reports }
    }


    @Sse(':id/events')
    events(
        @Param('id', new ParseIntPipe()) id: number,
        @Res() response: Response
    ) : Observable<MessageEvent> {
        return defer(() => this.reportService.findOne(id))
            .pipe(
                repeat({
                    delay: 1000,
                }),
                tap((report) => {
                    // encerra a conexao
                    if (report.status === Status.DONE || report.status === Status.ERROR) {
                        setTimeout(() => {
                            response.end()
                        }, 1000)
                    }
                }),
                map((report) => ({
                    type: 'message',
                    data: report
                }))
            )
    }
}
