import { Controller, Get } from '@nestjs/common';
import { CookiesAuthGuard } from '@common/guards';
import { VoidResourceResponse } from '@common/types';
import { SquadsService } from '../services/squads.service';
import { Summary, UserInRequest } from '@common/decorators';
import { SplitrSquadDto, SplitrSquadPayload } from '../dto/squads.dto';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { Body, Delete, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('splitr/squads')
@UseGuards(CookiesAuthGuard)
export class SquadsController {
    constructor(private readonly squadsService: SquadsService) {}

    @Get()
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get all splitr squads' })
    @Summary('Splitr squads retrieved', 'The user retrieved all splitr squads')
    @ApiResponse({
        status: 200,
        isArray: true,
        type: SplitrSquadDto,
        description: 'Splitr squads retrieved successfully',
    })
    getUserSplitrSquads(@UserInRequest() user: User): Promise<SplitrSquadDto[]> {
        return this.squadsService.getUserSplitrSquads(user.id);
    }

    @Post()
    @HttpCode(201)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Create a new splitr squad.' })
    @Summary('Splitr squad created', 'The user created a splitr squad')
    @ApiParam({ name: 'squadId', description: 'The ID of the squad to update' })
    @ApiBody({ type: SplitrSquadPayload, description: 'The payload to create a new splitr squad' })
    createSplitrSquad(@UserInRequest() user: User, @Body() payload: SplitrSquadPayload): Promise<SplitrSquadDto> {
        return this.squadsService.createSplitrSquad(user.id, payload);
    }

    @Put(':squadId')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Update a user splitr squad' })
    @Summary('Splitr squad updated', 'The user updated a splitr squad')
    @ApiParam({ name: 'squadId', description: 'The ID of the squad to update' })
    @ApiBody({ type: SplitrSquadPayload, description: 'The payload to update a splitr squad' })
    @ApiResponse({
        status: 200,
        description: 'Splitr user squad updated successfully',
    })
    updateExistingUserSplitrSquad(
        @UserInRequest() user: User,
        @Param('squadId') squadId: string,
        @Body() payload: SplitrSquadPayload,
    ): Promise<SplitrSquadDto> {
        return this.squadsService.updateExistingUserSplitrSquad(user.id, squadId, payload);
    }

    @Delete(':squadId')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Delete a user splitr squad' })
    @Summary('Splitr squad deleted', 'The user deleted a splitr squad')
    @ApiParam({ name: 'squadId', description: 'The ID of the squad to delete' })
    @ApiResponse({
        status: 200,
        description: 'Splitr user squad deleted successfully',
    })
    async deleteSplitrSquad(
        @UserInRequest() user: User,
        @Param('squadId') squadId: string,
    ): Promise<VoidResourceResponse> {
        const deleteSquad = await this.squadsService.deleteUserSplitrSquad(user.id, squadId);

        return {
            message: 'Squad deleted successfully!',
            details: `Your ${deleteSquad.squadName} squad has been deleted successfully.`,
        };
    }
}
