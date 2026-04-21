import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompanyProfileService } from './company-profile.service';
import { UpsertCompanyProfileDto } from './dto/upsert-company-profile.dto';

@ApiTags('company-profile')
@ApiBearerAuth()
@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly service: CompanyProfileService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Put()
  upsert(@Body() dto: UpsertCompanyProfileDto) {
    return this.service.upsert(dto);
  }
}
