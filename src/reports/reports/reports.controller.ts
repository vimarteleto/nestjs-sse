import { Controller, Get, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {

    constructor(private reportService: ReportsService) {}

    @Get()
    all() {
        return this.reportService.all()
    }

    @Post()
    request() {
        return this.reportService.request()
    }
}
