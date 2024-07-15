import IBase from './base';

interface IMiddleware {
  throttle: (requestor: IBase) => void;
  limit: (requestor: IBase) => void;
}

export default IMiddleware;
