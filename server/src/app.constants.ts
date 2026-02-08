import {AppModules} from './modules/modules.module';
import {GlobalExceptionFilter} from '@common/exceptions';
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import {GlobalResponseInterceptor} from '@common/interceptors';
import {InfrastructureModule} from '@infrastructure/infrastructure.module';
import {DynamicModule, ForwardReference, Provider, Type} from '@nestjs/common';

type ModuleImports = Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>;

export const APP_MODULE_IMPORTS: ModuleImports[] = [AppModules, InfrastructureModule];

export const APP_MODULE_PROVIDERS: Provider[] = [
    {
        provide: APP_INTERCEPTOR,
        useClass: GlobalResponseInterceptor,
    },
    {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter,
    },
];
