import { Controller, Get } from '@nestjs/common';
import { CookiesAuthGuard } from '@common/guards';
import { VoidResourceResponse } from '@common/types';
import { SquadsService } from '../services/squads.service';
import { Summary, UserInRequest } from '@common/decorators';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { SplitwiseSquadDto, SplitwiseSquadPayload } from '../dto/splitwise.dto';
import { Body, Delete, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('splitwise/squads')
@UseGuards(CookiesAuthGuard)
export class SquadsController {
    constructor(private readonly squadsService: SquadsService) {}

    @Get()
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get all splitwise squads' })
    @Summary('Splitwise squads retrieved', 'The user retrieved all splitwise squads')
    @ApiResponse({
        status: 200,
        isArray: true,
        type: SplitwiseSquadDto,
        description: 'Splitwise squads retrieved successfully',
    })
    getUserSplitwiseSquads(@UserInRequest() user: User): Promise<SplitwiseSquadDto[]> {
        return this.squadsService.getUserSplitwiseSquads(user.id);
    }

    @Post()
    @HttpCode(201)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Create a new splitwise squad' })
    @Summary('Splitwise squad created', 'The user created a splitwise squad')
    @ApiParam({ name: 'squadId', description: 'The ID of the squad to update' })
    @ApiBody({ type: SplitwiseSquadPayload, description: 'The payload to create a new splitwise squad' })
    createSplitwiseSquad(
        @UserInRequest() user: User,
        @Body() payload: SplitwiseSquadPayload,
    ): Promise<SplitwiseSquadDto> {
        return this.squadsService.createSplitwiseSquad(user.id, payload);
    }

    @Put(':squadId')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Update a user splitwise squad' })
    @Summary('Splitwise squad updated', 'The user updated a splitwise squad')
    @ApiParam({ name: 'squadId', description: 'The ID of the squad to update' })
    @ApiBody({ type: SplitwiseSquadPayload, description: 'The payload to update a splitwise squad' })
    @ApiResponse({
        status: 200,
        description: 'Splitwise user squad updated successfully',
    })
    updateExistingUserSplitwiseSquad(
        @UserInRequest() user: User,
        @Param('squadId') squadId: string,
        @Body() payload: SplitwiseSquadPayload,
    ): Promise<SplitwiseSquadDto> {
        return this.squadsService.updateExistingUserSplitwiseSquad(user.id, squadId, payload);
    }

    @Delete(':squadId')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Delete a user splitwise squad' })
    @Summary('Splitwise squad deleted', 'The user deleted a splitwise squad')
    @ApiParam({ name: 'squadId', description: 'The ID of the squad to delete' })
    @ApiResponse({
        status: 200,
        description: 'Splitwise user squad deleted successfully',
    })
    async deleteSplitwiseSquad(
        @UserInRequest() user: User,
        @Param('squadId') squadId: string,
    ): Promise<VoidResourceResponse> {
        const deleteSquad = await this.squadsService.deleteUserSplitwiseSquad(user.id, squadId);

        return {
            message: 'Squad deleted successfully!',
            details: `Your ${deleteSquad.squadName} squad has been deleted successfully.`,
        };
    }
}
