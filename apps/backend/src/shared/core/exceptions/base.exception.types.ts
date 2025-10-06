import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export type TErrorTypes =
  | unknown
  | Error
  | BadRequestException
  | UnauthorizedException
  | ForbiddenException
  | NotFoundException
  | UnprocessableEntityException
  | InternalServerErrorException
  | ServiceUnavailableException;

export type TAppErrorProps = {
  referrer: string;
  error: TErrorTypes;
};

export type TAppErrorData = {
  status: number;
  message: string;
};
