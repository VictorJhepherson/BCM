import { SetMetadata } from '@nestjs/common';

export const BY_PASS_KEY = 'by-pass';
export const ByPass = () => SetMetadata(BY_PASS_KEY, true);
