const ENTERO_POSITIVO = /^[1-9][0-9]{0,18}$/;
const MAX_BIGINT = 9223372036854775807n;

export function idValido(id) {
  return typeof id === "string" && ENTERO_POSITIVO.test(id) && BigInt(id) <= MAX_BIGINT;
}
