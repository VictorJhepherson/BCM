import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export type ErrorTypes =
  | unknown
  | Error
  | BadRequestException
  | UnauthorizedException
  | ForbiddenException
  | NotFoundException
  | UnprocessableEntityException
  | InternalServerErrorException
  | ServiceUnavailableException;
