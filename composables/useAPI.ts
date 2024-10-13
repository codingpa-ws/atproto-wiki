import {
  type NitroFetchOptions,
  type NitroFetchRequest,
  type TypedInternalResponse,
  type ExtractedRouteMethod,
} from "nitropack";

export default async function <
  T = unknown,
  R extends NitroFetchRequest = NitroFetchRequest,
  O extends NitroFetchOptions<R> = NitroFetchOptions<R>
>(
  request: R,
  opts?: O
): Promise<
  TypedInternalResponse<
    R,
    T,
    NitroFetchOptions<R> extends O ? "get" : ExtractedRouteMethod<R, O>
  >
> {
  const cookieHeaders = useRequestHeaders(["cookie"]);
  if (!opts) {
    opts = {} as any;
  }
  opts!.headers = opts!.headers || {};
  opts!.headers = { ...opts!.headers, ...cookieHeaders };

  return $fetch(request, opts);
}
