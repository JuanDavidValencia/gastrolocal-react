import test from "node:test";
import assert from "node:assert/strict";
import { idValido } from "./idReserva.js";

test("acepta identificadores positivos de reservas como texto", () => {
  for (const id of ["1", "24", "9007199254740993", "9223372036854775807"]) {
    assert.equal(idValido(id), true, id);
  }
});

test("rechaza identificadores fuera del contrato bigint", () => {
  for (const id of [
    undefined,
    24,
    "",
    "0",
    "-1",
    "01",
    "1.5",
    "1e3",
    "12abc",
    "24 ",
    "fa7391d5-7bb0-444d-9ec7-9924c400861b",
    "9223372036854775808",
  ]) {
    assert.equal(idValido(id), false, String(id));
  }
});
