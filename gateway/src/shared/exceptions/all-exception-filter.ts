import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    if (exception instanceof HttpException)
      return res.status(exception.getStatus()).json(exception.getResponse());

    if (exception.statusCode)
      return res.status(exception.statusCode).json(exception);

    console.log(exception);

    const newException = new InternalServerErrorException();
    return res
      .status(newException.getStatus())
      .json(newException.getResponse());
  }
}
