import { CookiesAuthGuard } from '@common/guards';
import { UserInRequest } from '@common/decorators';
import { BillsService } from '../services/bills.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BillDTO, CreateBillPayload } from '../dto/bills.dto';
import { ExposeEnumDto, VoidResourceResponse } from '@common/types';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';

@Controller('bills')
export class BillsController {
    constructor(private readonly billsService: BillsService) {}

    @Get('types')
    @ApiOperation({ summary: 'Get all bill types' })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: ExposeEnumDto,
        description: 'All bill types retrieved successfully',
    })
    getBillsTypes() {
        return this.billsService.getBillsTypes();
    }

    @Get('all')
    @HttpCode(200)
    @UseGuards(CookiesAuthGuard)
    @ApiOperation({ summary: 'Get all application bills' })
    @ApiResponse({
        status: 200,
        type: BillDTO,
        isArray: true,
        description: 'All application bills retrieved successfully',
    })
    getAllBills() {
        return this.billsService.getAllBills();
    }

    @Get()
    @UseGuards(CookiesAuthGuard)
    @ApiOperation({ summary: 'Get all user bills' })
    @ApiResponse({
        status: 200,
        type: BillDTO,
        isArray: true,
        description: 'All user bills retrieved successfully',
    })
    getUserBills(@UserInRequest() user: User) {
        return this.billsService.getUserBills(user.id);
    }

    @Post()
    @UseGuards(CookiesAuthGuard)
    @ApiOperation({ summary: 'Create a new bill' })
    @ApiResponse({
        status: 201,
        type: BillDTO,
        description: 'New bill created successfully',
    })
    createNewBill(@Body() payload: CreateBillPayload, @UserInRequest() user: User) {
        return this.billsService.createNewBill(user.id, payload);
    }

    @Delete(':billId')
    @UseGuards(CookiesAuthGuard)
    @ApiOperation({ summary: 'Delete a bill by its ID' })
    @ApiResponse({
        status: 200,
        type: VoidResourceResponse,
        description: 'Bill deleted successfully',
    })
    async deleteBillById(@UserInRequest() user: User, @Param('billId') billId: string): Promise<VoidResourceResponse> {
        const deletedBill = await this.billsService.deleteBillById(user.id, billId);

        return {
            message: 'The bill was deleted!',
            details: `Your [${deletedBill.name}] bill was been deleted successfully.`,
        };
    }
}
