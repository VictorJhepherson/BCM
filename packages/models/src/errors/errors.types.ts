import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

export type ErrorTypes =
  | unknown
  | Error
  | BadRequestException
  | UnauthorizedException
  | ForbiddenException
  | NotFoundException
  | InternalServerErrorException
  | ServiceUnavailableException;
