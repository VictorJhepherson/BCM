import { TScope } from '@bcm/models';
import { SetMetadata } from '@nestjs/common';

export const SCOPES_KEY = 'scopes';
export const Scopes = (scopes: TScope[]) => SetMetadata(SCOPES_KEY, scopes);
